import { Launcher } from "../controller/Launcher";


interface IStatusRequestPayload {
  accessToken: string | null;
}

export class StatusRequestPayload {
  accessToken: string | null;

  private constructor(attributes: IStatusRequestPayload){
    this.accessToken = attributes.accessToken
  }

  public static create(): StatusRequestPayload {
    const accessToken = Launcher.accessToken;
    return new StatusRequestPayload({ accessToken });
  }

  public toJSON(): IStatusRequestPayload {
    return {
        accessToken: this.accessToken
    }
  }
}