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

