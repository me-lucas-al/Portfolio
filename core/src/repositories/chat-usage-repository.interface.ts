export interface IChatUsageRepository {
  record(ipHash: string): Promise<void>;
  countSince(ipHash: string, since: Date): Promise<number>;
}
