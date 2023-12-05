import { environment } from '../../environments/environment';

export class AccessSettings {
  public static JAVA_BACKEND_URL = environment.javaBaseUrl + '/accessgrts/';

  public static PHYTHON_BACKEND_URL ='http://183.82.0.15:8090/api/parse/';

  public static SUCCESS = 'SUCCESS';
  public static ERROR = 'ERROR';
  // public static JAVA_BACKEND_URL = environment.javaBaseUrl;
  // public static SUCCESS = 'SUCCESS';
  // public static ERROR = 'ERROR';
}
