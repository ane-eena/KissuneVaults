declare module 'ssh2-sftp-client' {
  export default class SFTPClient {
    connect(config: {
      host: string;
      port: number;
      username: string;
      password: string;
      readyTimeout?: number;
    }): Promise<void>;
    
    get(remotePath: string): Promise<Buffer>;
    get(remotePath: string, localPath: string): Promise<void>;
    
    put(localPath: string | Buffer, remotePath: string): Promise<void>;
    
    list(remotePath: string): Promise<any[]>;
    
    end(): Promise<void>;
    
    client: any;
  }
}
