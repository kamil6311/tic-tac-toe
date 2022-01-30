export class Player {
  constructor(
    public username: string,
    public host: boolean,
    public turn: boolean,
    public socketId: string,
    public roomId?: string,
    public playedCell?: number,
    public win?: boolean
    ){}
}
