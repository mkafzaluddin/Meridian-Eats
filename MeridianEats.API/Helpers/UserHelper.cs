using System.Security.Claims;

namespace MeridianEats.API.Helpers;

public static class UserHelper
{
    public static int GetUserId(ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }
}