using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Repository;

public class UsersRepository : IUsersRepository
{
    private readonly ResearchCruiseContext _context;


    public UsersRepository(ResearchCruiseContext context)
    {
        _context = context;
    }
    
    public int AddUser(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();

        return user.Id;
    }

    public User? GetUserById(int id)
    {
        return _context.Users.SingleOrDefault(user => user.Id == id);
    }

    public List<User> GetAllUsers()
    {
        return _context.Users.ToList();
    }
}