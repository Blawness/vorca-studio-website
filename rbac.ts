import { defineRbac, presets } from "@blawness/admin-kit/rbac";

export const rbac = defineRbac({
    roles: { ...presets.adminEditor },
    fallbackRole: "editor",
    protectedPermission: "users.delete",
});
