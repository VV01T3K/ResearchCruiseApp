using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Repository;

public class UsersRepository : IUsersRepository
{
    private readonly List<User> _users = new();
    
    
    public void AddUser(User user)
    {
        user.Id = _users.Count;
        _users.Add(user);
    }

    public User? GetUserById(int id)
    {
        return _users.SingleOrDefault(user => user.Id == id);
    }

    public List<User> GetAllUsers()
    {
        return _users;
    }
}