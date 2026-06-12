
export type PermissionMap = {
	[key: string]: string[];
}

export const PERMISSIONS_MAP: PermissionMap = {
	"/home": ["ROLE_CLIENT","ROLE_ADMIN","ROLE_PROFESSIONAL"],	
	"/dashboard": ["ROLE_ADMIN","ROLE_PROFESSIONAL"],	
	"/appointments": ["ROLE_CLIENT","ROLE_ADMIN","ROLE_PROFESSIONAL"],
	"/establishments": ["ROLE_ADMIN","ROLE_PROFESSIONAL"],
	"/employees": ["ROLE_ADMIN"],
	"/services": ["ROLE_ADMIN","ROLE_PROFESSIONAL"],
	"/clients": ["ROLE_ADMIN"],
	"/configurations": ["ROLE_CLIENT","ROLE_ADMIN","ROLE_PROFESSIONAL"],
}