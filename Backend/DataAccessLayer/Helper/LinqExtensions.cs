using DataAccessLayer.Dto;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Helper
{
    public static class LinqExtensions
    {
        public static async Task<PaginatedResponse<List<T>>> ToPaginateListAsync<T>(this IQueryable<T> query, int? pageNo,
            int? pageSize, bool enforceDefaultValues = true)
        {
            if (!enforceDefaultValues &&  
                ( pageNo == null || pageSize == null || pageNo == 0 || pageSize == 0 ))
            {
                return new PaginatedResponse<List<T>>()
                {
                    Value = await query.ToListAsync()
                };
            }

            // Set default values
            if (pageNo == null || pageNo == 0)
                pageNo = Constants.DEFAULT_PAGE_NO;
            if (pageSize == null || pageSize == 0)
                pageSize = Constants.DEFAULT_PAGE_SIZE;
            else if (pageSize > Constants.MAX_PAGE_SIZE)
                pageSize = Constants.MAX_PAGE_SIZE;


            var skip = 0;
            if (pageNo != 1)
                skip = (int) pageSize * ((int) pageNo - 1);

            return new PaginatedResponse<List<T>>()
            {
                Value = await query.Skip(skip).Take((int) pageSize).ToListAsync(),
                TotalCount = await query.CountAsync()
            };
        }
    }
}
