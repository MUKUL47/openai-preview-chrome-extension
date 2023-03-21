export default class ExtensionSharedService {
  public static readonly SANDBOX_POPUP_KEY = `${Date.now()}-${Math.random()}`;
  public static s: any = () => {};
}
