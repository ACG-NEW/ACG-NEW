import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs';
import { AccessSettings } from '@/utils/access-settings';
import { UserAccess } from './user-access.modal';
// import { UserAccess } from 'src/app/service/user-access.modal';
@Injectable()
export class AccessService {
  constructor(private http: HttpClient) { }


  getAppNames() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getappnames');
  }

  getuserSpecificAccess(useracces: UserAccess) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'getuserSpecificAccess/', useracces);
  }

  getAccessPoints(applicationName: string, accessPoint: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getaccesspoints/' + accessPoint + '/' + applicationName + '/' + condition);
  }

  getaccessgroupsheaders(applicationName: string, accessGroup: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getaccessgroupsheaders/' + accessGroup + '/' + applicationName + '/' + condition);
  }
  getaccessgroupslines(accessLine: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getaccessgroupslines/' + accessLine);
  }
  getsourceappusers(applicationName: string, userName: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getsourceappusers/' + userName + '/' + applicationName + '/' + condition);
  }

  getsourceappuserRoles(applicationName: string, roleId: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getsourceappuserRoles/' + roleId + '/' + applicationName + '/' + condition);
  }

  getbusinessentity(applicationName: string, businesEntityName: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getbusinessentity/' + businesEntityName + '/' + applicationName + '/' + condition);
  }

  getroleToaccessgroupmapping(applicationName: string, userRole: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getroleToaccessgroupmapping/' + userRole + '/' + applicationName + '/' + condition);
  }

  getroleTobusinessentitymapping(applicationName: string, userRole: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getroleTobusinessentitymapping/' + userRole + '/' + applicationName + '/' + condition);
  }
  getBussEntityByAppId(applicationName: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getBussEntityByAppId/' + '/' + applicationName  );
  }

  getuserRolemapping(applicationName: string, userRole: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getuserRolemapping/' + userRole + '/' + applicationName + '/' + condition);
  }

  errorHandler(error: HttpErrorResponse) {
    console.log('errorHandler', error.message);
    return throwError(error.message || 'server Error');
  }
}
