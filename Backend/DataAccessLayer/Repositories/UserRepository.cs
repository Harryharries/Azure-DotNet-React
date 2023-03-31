using DataAccessLayer.data;
using DataAccessLayer.Dto;
using DataAccessLayer.Helper;
using Microsoft.EntityFrameworkCore;
using Types.Model;

namespace Medfar.Interview.DAL.Repositories
{
    public class UserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context; //DI
        }

        public async Task<PaginatedResponse<List<UserLite>>> GetUsers(
            string? filter,
            int pageNo,
            int pageSize
            )
        {
            var UserQuery = _context.Users.AsQueryable();

            // if filter is not null apply the filter function
            if (filter != null)
            {
                UserQuery = ApplyFilter(UserQuery, filter);
            }
            // Query the database and project each User entity to UserLite object that provided minimized data for security 
            var r = await UserQuery.Select(user => new UserLite
            {
                id = user.id,
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                date_created = user.date_created,
            }).ToPaginateListAsync(pageNo, pageSize); //extension method is used to apply pagination and retrieve a paginated list of users from the database.
            return r;
        }

        public async Task<(Guid? id, string? Message)> CreateUsers(UserCreate user)
        {
            // check if there is duplicated email
            var emailExist = await _context.Users.AnyAsync(u => u.email == user.email.Trim());
            if (emailExist)
                return (null, "The email is already exist");

            // Create a new user entity
            var newUser = new User
            {
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                date_created = DateTime.UtcNow
            };

            // add new user and save data back into db by using efcore tracker
            _context.Add(newUser);
            await _context.SaveChangesAsync();
            return (newUser.id, null);
        }

        // A filter to search generally. it will search user's firstname, lastname, firstname + lastname and email
        public IQueryable<User> ApplyFilter(IQueryable<User> userQuery, string filter)
        {
            filter = filter.ToLower();
            // Defaultly consider that there should be no '@' in human's name.
            // so checking if there is @ in filter string. if so, it can only seach email field to improve performance
            // It can be changed once we acknowledge that there is a super eage case ;)
            if (filter.Contains('@'))
            {
                userQuery = userQuery.Where(u => u.email.Contains(filter));
            }
            else
            {
                //search the userQuery where the user's first name, last name or both, contains the filter text.
                //If the filter text contains any whitespace, it's also checked if the full name matches the filter text.
                userQuery = userQuery.Where(u =>
                    u.first_name.Contains(filter) ||
                    u.last_name.Contains(filter) ||
                    (filter.Any(char.IsWhiteSpace) && (u.first_name.ToLower() + " " + u.last_name.ToLower()).Contains(filter))
                );
            }

                return userQuery;
        }
    }
}