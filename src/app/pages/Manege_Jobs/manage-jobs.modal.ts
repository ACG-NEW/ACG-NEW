export class ProgramDetails {
  program_id: number;
  program_code: string;
  program_name: string;
  exeType:string;
  output_type: string;
  allow_parallel: string;
  active_flag: String;
  start_date: Date;
  end_date: Date;
  creation_date: Date;
  created_by: number;
  last_update: Date;
  last_by: number;
  groupId: number;
  exeName: string;
}
export class JobDetails {
  job_name: string;
  job_id: number;
  start_date: Date;
  end_date: Date;
  running_status: string;
  completion_status: string;
  log_link: string;
  submission_time: string;
  output_link: string;
  program_id: number;
  program_code: string;
  program_name: string;
  exe_id: number;
  output_type: string;
  creation_date: Date;
  created_by: number;
  last_update: Date;
  last_by: number;
}
export class ProgramParams {
  program_id: number;
  param_name: string;
  param_desc: string;
  param_type: String;
  sql: string;
  sql_valid: string;
  start_date: Date;
  end_date: Date;
  display_sequence: number;
}
export class SubmitParams {
	sqlDataValue:string;
	 numberValue:number;
  dateValue:string;
  jobName:string;

  program_id: number;
  param_name: string;
  param_desc: string;
  param_type: String;
  condition:string;
  sql: string;
  sqlData:any[];



}
export class JobStatus {
  job_id: number;
  program_id: number;
  running_status: string;
  completion_status: string;
  submission_time: Date;
  completion_time: Date;
  completion_text: string;
  log_link: string;
  output_link: string;
  creation_date: Date;
  created_by: number;
  last_update: string;
  last_by: number;
}



export class JobSchedule {
  schedule_id: number;
  program_id: number;
  frequency: string;
  schedule_time: string;
  schedule_week_days: any[]
  schedule_days: any[];
  other_days: any[];
  validFrom: Date;
  validTo: Date;
}
export class progpramMap{
  progpramMap:SubmitParams[];
}
