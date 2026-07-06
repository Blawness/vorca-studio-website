import { defineRbac, presets } from "@blawness/admin-kit/rbac";

const editorPerms = presets.adminEditor.editor;

export const rbac = defineRbac({
    roles: {
        admin: ["*"],
        editor: [
            ...editorPerms,
            "projects.read",
            "projects.create",
            "projects.update",
            "projects.delete",
            "clientRequests.review",
        ],
        // Clients authenticate through the same NextAuth instance but hold NO
        // admin permissions — the portal authorizes them by role + ownership,
        // not by these permissions. An empty list keeps every CMS screen closed.
        client: [],
    },
    fallbackRole: "editor",
    protectedPermission: "users.delete",
});
