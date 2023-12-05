export class User {
  user_id: number;
  user_name: string;
  user_firstname: string;
  user_middlename: string;
  user_lastname: string;
  start_date: Date;
  end_date: Date;
  user_email: string;
  password: string;
  userRoles: UserRole[] = [];
}

export class UserRole {
  user_id: number;
  role_id: number;
  role_code: string;
  role_desc: string;
  start_date: Date;
  end_date: Date;
  inlcude_exclude_flag: string;
  status: string;
  creation_date: Date;
  created_by: number;
  last_update: Date;
  last_by: number;
}

export class GroupUsers {
  groupId: number;
  userId: number;
  userName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;
  activeFlag: string;
  creationDate: Date;
  createdBy: number;
  lastUpdate: Date;
  lastBy: number;
}








export class Role {
  role_id: number;
  role_code: string;
  role_desc: string;
  start_date: Date;
  end_date: Date;
  inlcude_exclude_flag: string;
  status: string;
  creation_date: Date;
  created_by: number;
  last_update: Date;
  last_by: number;
  roleMenus: RoleMenu[] = [];
}


export class RoleMenu {
  role_id: number;
  menu_id: number;
  menu_code: string;
  menu_desc: string;
  start_date: Date;
  end_date: Date;
  active_flag: string;
  creation_date: Date;
  created_by: number;
  last_update: Date;
  last_by: number;
}

export class UserGroup {
  groupId: number;
  groupCode: string;
  groupDesc: string;
  activeFlag: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  createdBy: number;
  lastUpdate: Date;
  lastBy: number;
  userId: number;
  groupUsers: GroupUsers[] = [];

}

export class Functions {
  function_id: string;
  function_code: string;
  function_type: string;
  function_desc: string;
  start_date: string;
  end_date: string;
  active_flag: string;
  creation_date: string;
  created_by: string;
  last_update: string;
  last_by: string;
}

export class Menus {
  menu_id: string;
  menu_code: string;
  menu_desc: string;
  start_date: string;
  end_date: string;
  active_flag: string;
  creation_date: string;
  created_by: string;
  last_update: string;
  last_by: string;
  menuFunctions: MenuFunction[] = [];
}

export class MenuFunction {
  menu_id: number;
  function_id: number;
	function_code: string;
  function_desc: string;
  start_date: Date;
  end_date: Date;
  active_flag: string;
  creation_date: Date;
  created_by: number;
  last_update: Date;
  last_by: number;
}

