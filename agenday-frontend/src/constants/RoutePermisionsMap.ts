
export type PermissionMap = {
	[key: string]: string[];
}

export const PERMISSIONS_MAP: PermissionMap = {
	"/home": ["ROLE_CLIENT","ROLE_ADMIN"],	
	"/dashboard": ["ROLE_CLIENT","ROLE_ADMIN"],	
	"/agenda": ["ROLE_CLIENT","ROLE_ADMIN"],
	"/establishments": ["ROLE_CLIENT","ROLE_ADMIN"],
	"/employees": ["ROLE_CLIENT","ROLE_ADMIN"],
	"/services": ["ROLE_ADMIN"],
	"/clients": ["ROLE_CLIENT","ROLE_ADMIN"],
	"/configurations": ["ROLE_CLIENT"],
}