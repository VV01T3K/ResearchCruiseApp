using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Repository;

public interface IUsersRepository
{
    public void AddUser(User user);

    public User? GetUserById(int id);

    public List<User> GetAllUsers();
}