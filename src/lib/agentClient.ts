/* eslint-disable @typescript-eslint/no-explicit-any */

export type AgentRole = "user" | "assistant" | "system" | "tool";

export type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export interface AzureAgentConfig {
  /**
   * Azure AI Foundry project endpoint base URL
   * Example: https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter
   */
  projectEndpoint: string;

  /**
   * Application/agent name within the project
   * Example: marketing-orchestrator
   */
  applicationName: string;

  /**
   * Azure AI API key for authentication
   */
  apiKey?: string;

  /**
   * API version to use
   */
  apiVersion?: string;

  /**
   * Optional: Provide a token for Authorization header.
   */
  getAuthHeader?: () => Promise<string> | string;

  /**
   * Optional headers to send on every request.
   */
  headers?: Record<string, string>;

  /**
   * Request timeout (ms). Default: 30000ms.
   */
  requestTimeoutMs?: number;

  /**
   * Client name (used in "from" field).
   */
  userId?: string;

  /**
   * Friendly user name.
   */
  userName?: string;

  /**
   * When true, logs helpful debug info.
   */
  debug?: boolean;
}

export interface AgentClientConfig extends Omit<AzureAgentConfig, 'projectEndpoint' | 'applicationName' | 'apiVersion'> {
  /**
   * Base URL of your agent gateway (recommended) or Azure AI Agent endpoint.
   */
  baseUrl: string;

  /**
   * Polling interval for new messages (ms). Default: 900ms.
   */
  pollIntervalMs?: number;
}

export interface AgentActivity {
  type: "message" | string;
  id?: string;
  timestamp?: string;
  from?: { id?: string; name?: string; role?: AgentRole };
  text?: string;
  channelData?: any;
  attachments?: any[];
  value?: any; // tool outputs / structured payloads (optional)
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  text: string;
  timestamp?: string;
  raw?: AgentActivity;
}

type Unsubscribe = () => void;

function nowIso() {
  return new Date().toISOString();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeJsonParse<T>(input: string): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    return null;
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  onTimeoutMessage = "Request timed out"
): Promise<T> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(onTimeoutMessage), ms);

  try {
    // @ts-expect-error - we pass signal to fetch only; for other promises no effect
    const res = await promise(ctrl.signal);
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number
) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timeout);
  }
}

class Emitter<T> {
  private listeners = new Set<(evt: T) => void>();
  on(cb: (evt: T) => void): Unsubscribe {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
  emit(evt: T) {
    for (const cb of this.listeners) cb(evt);
  }
  clear() {
    this.listeners.clear();
  }
}

export class AzureAgentClient {
  private projectEndpoint: string;
  private applicationName: string;
  private apiVersion: string;
  private apiKey?: string;
  private getAuthHeader?: () => Promise<string> | string;
  private headers: Record<string, string>;
  private requestTimeoutMs: number;
  private userId: string;
  private userName: string;
  private debug: boolean;

  private state: ConnectionState = "idle";
  private sessionId: string | null = null;

  private stateEmitter = new Emitter<ConnectionState>();
  private messageEmitter = new Emitter<AgentMessage>();
  private rawEmitter = new Emitter<AgentActivity>();
  private errorEmitter = new Emitter<Error>();

  constructor(config: AzureAgentConfig) {
    this.projectEndpoint = config.projectEndpoint.replace(/\/+$/, "");
    this.applicationName = config.applicationName;
    this.apiVersion = config.apiVersion ?? "2025-11-15-preview";
    this.apiKey = config.apiKey;
    this.getAuthHeader = config.getAuthHeader;
    this.headers = config.headers ?? {};
    this.requestTimeoutMs = config.requestTimeoutMs ?? 30000;
    this.userId = config.userId ?? `user-${Math.random().toString(16).slice(2)}`;
    this.userName = config.userName ?? "Guest";
    this.debug = config.debug ?? false;
  }

  private getActivityProtocolUrl(): string {
    return `${this.projectEndpoint}/applications/${this.applicationName}/protocols/activityprotocol?api-version=${this.apiVersion}`;
  }

  private getResponsesUrl(): string {
    return `${this.projectEndpoint}/applications/${this.applicationName}/protocols/openai/responses?api-version=${this.apiVersion}`;
  }

  // ---------- Public subscriptions ----------
  onState(cb: (s: ConnectionState) => void): Unsubscribe {
    return this.stateEmitter.on(cb);
  }
  onMessage(cb: (m: AgentMessage) => void): Unsubscribe {
    return this.messageEmitter.on(cb);
  }
  onRawActivity(cb: (a: AgentActivity) => void): Unsubscribe {
    return this.rawEmitter.on(cb);
  }
  onError(cb: (e: Error) => void): Unsubscribe {
    return this.errorEmitter.on(cb);
  }

  getState() {
    return this.state;
  }

  getSessionId() {
    return this.sessionId;
  }

  // ---------- Lifecycle ----------
  async connect(): Promise<void> {
    if (this.state === "connected" || this.state === "connecting") return;

    this.setState("connecting");

    try {
      this.sessionId = `session-${Math.random().toString(16).slice(2)}-${Date.now()}`;
      this.setState("connected");
      this.log("Connected with session ID:", this.sessionId);
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.setState("error");
      this.errorEmitter.emit(e);
      throw e;
    }
  }

  async disconnect(): Promise<void> {
    this.sessionId = null;
    this.setState("disconnected");
  }

  /**
   * Send a message using Azure AI Agent OpenAI responses endpoint
   */
  async sendMessage(
    text: string,
    opts?: { context?: any; metadata?: Record<string, any> }
  ): Promise<string> {
    if (!this.sessionId) {
      await this.connect();
    }

    try {
      const url = this.getResponsesUrl();
      const headers = await this.authHeaders();

      this.log("POST", url, { message: text, context: opts?.context });

      const body = {
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
        ...(opts?.context ? { context: opts.context } : {}),
        ...(opts?.metadata ? { metadata: opts.metadata } : {}),
      };

      const res = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        },
        this.requestTimeoutMs
      );

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        this.log("Error response:", res.status, errorText);
        throw new Error(`Azure AI request failed: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      this.log("Response data:", data);

      let responseText = "";
      
      if (data.choices && data.choices.length > 0) {
        responseText = data.choices[0].message?.content || "";
      } else if (data.message) {
        responseText = data.message;
      } else if (data.content) {
        responseText = data.content;
      } else if (typeof data === "string") {
        responseText = data;
      }

      if (!responseText) {
        responseText = "No response from agent";
      }

      const assistantMessage: AgentMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: responseText,
        timestamp: nowIso(),
        raw: data,
      };

      this.messageEmitter.emit(assistantMessage);

      return responseText;
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.errorEmitter.emit(e);
      throw e;
    }
  }

  // ---------- Core HTTP ----------
  private async authHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.headers,
    };

    if (this.apiKey) {
      headers["api-key"] = this.apiKey;
    }

    if (this.getAuthHeader) {
      const v = await this.getAuthHeader();
      if (v) headers["Authorization"] = v;
    }

    return headers;
  }

  private log(...args: any[]) {
    if (this.debug) console.log("[AzureAgentClient]", ...args);
  }

  private setState(s: ConnectionState) {
    if (this.state === s) return;
    this.state = s;
    this.stateEmitter.emit(s);
  }
}

export class AgentClient {
  private cfg: Required<
    Pick<
      AgentClientConfig,
      "pollIntervalMs" | "requestTimeoutMs" | "userId" | "userName" | "debug"
    >
  > &
    Omit<AgentClientConfig, "pollIntervalMs" | "requestTimeoutMs" | "userId" | "userName" | "debug">;

  private state: ConnectionState = "idle";
  private conversationId: string | null = null;
  private watermark: string | null = null;
  private pollTask: Promise<void> | null = null;
  private stopPolling = false;

  private stateEmitter = new Emitter<ConnectionState>();
  private messageEmitter = new Emitter<AgentMessage>();
  private rawEmitter = new Emitter<AgentActivity>();
  private errorEmitter = new Emitter<Error>();

  constructor(config: AgentClientConfig) {
    this.cfg = {
      pollIntervalMs: config.pollIntervalMs ?? 900,
      requestTimeoutMs: config.requestTimeoutMs ?? 20000,
      userId: config.userId ?? `user-${Math.random().toString(16).slice(2)}`,
      userName: config.userName ?? "Guest",
      debug: config.debug ?? false,
      ...config,
    };
    this.cfg.baseUrl = this.cfg.baseUrl.replace(/\/+$/, "");
  }

  // ---------- Public subscriptions ----------
  onState(cb: (s: ConnectionState) => void): Unsubscribe {
    return this.stateEmitter.on(cb);
  }
  onMessage(cb: (m: AgentMessage) => void): Unsubscribe {
    return this.messageEmitter.on(cb);
  }
  onRawActivity(cb: (a: AgentActivity) => void): Unsubscribe {
    return this.rawEmitter.on(cb);
  }
  onError(cb: (e: Error) => void): Unsubscribe {
    return this.errorEmitter.on(cb);
  }

  getState() {
    return this.state;
  }

  getConversationId() {
    return this.conversationId;
  }

  // ---------- Lifecycle ----------
  async connect(): Promise<void> {
    if (this.state === "connected" || this.state === "connecting") return;

    this.setState("connecting");
    this.stopPolling = false;

    try {
      const convo = await this.createConversation();
      this.conversationId = convo.conversationId;
      this.watermark = null;

      this.setState("connected");
      this.startPollingLoop();
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.setState("error");
      this.errorEmitter.emit(e);
      throw e;
    }
  }

  async disconnect(): Promise<void> {
    this.stopPolling = true;
    this.conversationId = null;
    this.watermark = null;
    this.setState("disconnected");
  }

  /**
   * Send a text message to the agent.
   * Optionally include `context` (brief JSON) and `metadata` (UI hints).
   */
  async sendMessage(
    text: string,
    opts?: { context?: any; metadata?: Record<string, any> }
  ): Promise<void> {
    if (!this.conversationId) {
      await this.connect();
    }
    if (!this.conversationId) throw new Error("No conversationId");

    const activity: AgentActivity = {
      type: "message",
      from: { id: this.cfg.userId, name: this.cfg.userName, role: "user" },
      text,
      channelData: {
        ...(opts?.metadata ?? {}),
        context: opts?.context ?? undefined,
      },
    };

    await this.postActivity(this.conversationId, activity);

    // Also emit local echo (optional but makes UI feel snappy)
    this.messageEmitter.emit({
      id: `local-${Math.random().toString(16).slice(2)}`,
      role: "user",
      text,
      timestamp: nowIso(),
      raw: activity,
    });
  }

  // ---------- Core HTTP (DirectLine-like) ----------
  private async authHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.cfg.headers ?? {}),
    };

    if (this.cfg.getAuthHeader) {
      const v = await this.cfg.getAuthHeader();
      if (v) headers["Authorization"] = v;
    }

    return headers;
  }

  private log(...args: any[]) {
    if (this.cfg.debug) console.log("[AgentClient]", ...args);
  }

  private async createConversation(): Promise<{ conversationId: string }> {
    const url = `${this.cfg.baseUrl}/conversations`;
    const headers = await this.authHeaders();

    this.log("POST", url);

    const res = await fetchWithTimeout(
      url,
      { method: "POST", headers, body: JSON.stringify({}) },
      this.cfg.requestTimeoutMs
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`createConversation failed: ${res.status} ${body}`);
    }

    const json = (await res.json()) as any;
    if (!json?.conversationId) {
      throw new Error("createConversation: missing conversationId");
    }
    return { conversationId: String(json.conversationId) };
  }

  private async postActivity(conversationId: string, activity: AgentActivity): Promise<void> {
    const url = `${this.cfg.baseUrl}/conversations/${encodeURIComponent(conversationId)}/activities`;
    const headers = await this.authHeaders();

    this.log("POST", url, activity);

    const res = await fetchWithTimeout(
      url,
      { method: "POST", headers, body: JSON.stringify(activity) },
      this.cfg.requestTimeoutMs
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`postActivity failed: ${res.status} ${body}`);
    }
  }

  private async getActivities(conversationId: string, watermark?: string | null) {
    const qs = watermark ? `?watermark=${encodeURIComponent(watermark)}` : "";
    const url = `${this.cfg.baseUrl}/conversations/${encodeURIComponent(conversationId)}/activities${qs}`;
    const headers = await this.authHeaders();

    const res = await fetchWithTimeout(
      url,
      { method: "GET", headers },
      this.cfg.requestTimeoutMs
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`getActivities failed: ${res.status} ${body}`);
    }

    const json = (await res.json()) as {
      activities?: AgentActivity[];
      watermark?: string;
    };

    return {
      activities: json.activities ?? [],
      watermark: json.watermark ?? watermark ?? null,
    };
  }

  // ---------- Poll loop ----------
  private startPollingLoop() {
    if (!this.conversationId) return;
    if (this.pollTask) return;

    const conversationId = this.conversationId;
    this.pollTask = (async () => {
      this.log("poll loop start", { conversationId });

      while (!this.stopPolling && this.conversationId === conversationId) {
        try {
          const { activities, watermark } = await this.getActivities(conversationId, this.watermark);
          this.watermark = watermark ?? this.watermark;

          for (const a of activities) {
            // Emit raw for observability panel
            this.rawEmitter.emit(a);

            // Only map message activities from assistant/bot
            if (a.type === "message") {
              const fromRole =
                (a.from?.role as AgentRole | undefined) ??
                (a.from?.id && a.from.id === this.cfg.userId ? "user" : "assistant");

              // Skip echo user messages coming back from server (optional)
              if (fromRole === "user") continue;

              const text = a.text ?? this.extractTextFromValue(a.value) ?? "";
              if (!text) continue;

              this.messageEmitter.emit({
                id: a.id ?? `srv-${Math.random().toString(16).slice(2)}`,
                role: "assistant",
                text,
                timestamp: a.timestamp,
                raw: a,
              });
            }
          }

          await sleep(this.cfg.pollIntervalMs);
        } catch (err: any) {
          const e = err instanceof Error ? err : new Error(String(err));
          this.errorEmitter.emit(e);

          // Soft-reconnect strategy
          if (!this.stopPolling) {
            this.setState("reconnecting");
            await sleep(Math.min(2500, this.cfg.pollIntervalMs * 2));
            this.setState("connected");
          } else {
            break;
          }
        }
      }

      this.log("poll loop end");
      this.pollTask = null;
    })();
  }

  private extractTextFromValue(value: any): string | null {
    if (!value) return null;

    // Common patterns when the agent returns structured payloads:
    //  - { text: "..." }
    //  - { summary: "..." }
    //  - { message: "..." }
    //  - stringified JSON
    if (typeof value === "string") {
      const maybeJson = safeJsonParse<any>(value);
      if (maybeJson) return this.extractTextFromValue(maybeJson);
      return value;
    }

    if (typeof value === "object") {
      if (typeof value.text === "string") return value.text;
      if (typeof value.summary === "string") return value.summary;
      if (typeof value.message === "string") return value.message;
    }

    return null;
  }

  private setState(s: ConnectionState) {
    if (this.state === s) return;
    this.state = s;
    this.stateEmitter.emit(s);
  }
}
