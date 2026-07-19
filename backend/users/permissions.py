from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        if request.user.is_superuser or request.user.is_staff:
            return True
    
        profile = getattr(request.user, 'userprofile', None)
        if profile and getattr(profile, 'role', None) == 'admin':
            return True

        return False
    

class IsTeacherRole(permissions.BasePermission):
    def has_permission(self, request, view):

        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.user.is_superuser and request.user.is_staff:
            return True
        
        profile = getattr(request.user, 'userprofile', None)
        if profile and getattr(profile, 'role', None) == 'teacher':
            return True

        return False