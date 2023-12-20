using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Repository;

public interface ICatsRepository
{
    public int AddCat(Cat cat);

    public Cat? GetCatById(int id);

    public List<Cat> GetAllCats();
}