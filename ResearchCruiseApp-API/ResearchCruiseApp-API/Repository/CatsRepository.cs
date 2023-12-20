using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Repository;

public class CatsRepository : ICatsRepository
{
    private readonly ResearchCruiseContext _context;


    public CatsRepository(ResearchCruiseContext context)
    {
        _context = context;
    }
    
    public int AddCat(Cat cat)
    {
        _context.Cats.Add(cat);
        _context.SaveChanges();

        return cat.Id;
    }

    public Cat? GetCatById(int id)
    {
        return _context.Cats.SingleOrDefault(cat => cat.Id == id);
    }

    public List<Cat> GetAllCats()
    { 
        return _context.Cats.ToList();
    }
}