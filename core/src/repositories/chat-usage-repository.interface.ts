export type ChatUsageKind = "chat" | "tts";

export interface IChatUsageRepository {
  record(ipHash: string, kind: ChatUsageKind): Promise<void>;
  countSince(ipHash: string, since: Date, kind: ChatUsageKind): Promise<number>;
  countAllSince(since: Date, kind: ChatUsageKind): Promise<number>;
}
