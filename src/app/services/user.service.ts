import { AccessSettings } from '@/utils/access-settings';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Functions, Menus, Role, User, UserGroup } from '@pages/User_Management/user.modal';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;
  switchTab = "firstTab";
  constructor(private http: HttpClient) { }
  getUsersList(name: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getUsersList/' + name + '/' + condition);
  }
  getRolesList(name: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getRolesList/' + name + '/' + condition);
  }
  getUser(name: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getUser/' + name);
  }
  getAllUsers() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllUsers');
  }
  getAllGroups() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllGroups');
  }
  getRole(name: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getRole/' + name);
  }
  getAllRoles() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllRoles');
  }

  addUser(user: User) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'createUser/', user);
  }

  updateUser(user: User) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateUser/', user);
  }

  updateUserRole(user: User) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateUserRole/', user);
  }

  addUserRole(user: User) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'addUserRole/', user);
  }

  getUserRole(userId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getUserRoles/' + userId);
  }

  deleteUserRole(user: User) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'deleteUserRole/', user);
  }

  createRole(role: Role) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'createRole/', role);
  }
  createGroup(userGroup: UserGroup) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'createUserGroup/', userGroup);
  }

  updateRole(role: Role) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateRole/', role);
  }
  updateGroup(userGroups: UserGroup) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateGroupUsers/', userGroups);
  }
  updateUserGroup(userGroups: UserGroup) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateUserGroup/', userGroups);
  }

  getUserGroupMapping(groupId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getUserGroupsMap/' + groupId);
  }

  getUserGroups(groupId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getUserGroups/' + groupId);
  }

  getUserGroupsList(name: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getUserGroupsList/' + name + '/' + condition);
  }

  addGroupUsers(userGroups: UserGroup) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'addGroupUsers/', userGroups);
  }
  // registerApplication(regApp : RegisterApplications) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json'
  //       //'Authorization': 'my-auth-token'
  //     })
  //   };
  //   return this.http
  //   .post<RegisterApplications> (AccessSettings.JAVA_BACKEND_URL + 'registerApp', regApp, httpOptions);
  // }
  getFunctionsList(name: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getFunctionsList/' + name + '/' + condition);
  }

  getMenusList(name: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getMenusList/' + name + '/' + condition);
  }

  getMenu(name: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getMenu/' + name);
  }

  createMenu(func: Menus) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'createMenu/', func);
  }

  updateMenu(func: Menus) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'updateMenu/', func);
  }

  getLicenseList(name: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getLicenseList/' + name);
  }

  // getUser(name: string) {
  //   return this.http
  //     .get(AccessSettings.JAVA_BACKEND_URL + 'getUser/' + name);
  // }


  getFunction(name: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getFunction/' + name);
  }

  createFunction(func: Functions) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'createFunction/', func);
  }

  updateFunction(func: Functions) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'updateFunction/', func);
  }

  getRoleMenu(roleId: string) {
    return this.http
    .get(AccessSettings.JAVA_BACKEND_URL + 'getRoleMenus/' + roleId);
  }

  addRoleMenu(role: Role) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'addRoleMenu/', role);
  }

  updateRoleMenu(role: Role) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'updateRoleMenu/', role);
  }

  getAllMenus() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllMenus');
  }

  getAllFunctions() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllFunctions');
  }

  getMenuFunction(menuId: string) {
    return this.http
    .get(AccessSettings.JAVA_BACKEND_URL + 'getMenuFunctions/' + menuId);
  }

  addMenuFunction(menu: Menus) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'addMenuFunction/', menu);
  }

  updateMenuFunction(menu: Menus) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'updateMenuFunction/', menu);
  }

  executeScript(script: string) {
    return this.http
    .post(AccessSettings.JAVA_BACKEND_URL + 'executeScript/', script);
  }
}
