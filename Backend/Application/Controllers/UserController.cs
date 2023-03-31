using DataAccessLayer.Dto;
using Medfar.Interview.DAL.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;

namespace Core.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        // Dependency injection of UserRepository to be more testable and scalable
        public UserController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        //[Authorize] -> this one should be added once we got users account and have a way to authentication and authorization
        [Produces("application/json")]
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserLite>))]
        public async Task<ActionResult<PaginatedResponse<List<UserLite>>>> GetUsers(
            string? filter,
            int pageNo = 1,
            int pageSize = 30
            )
        {
            var response = new PaginatedResponse<List<UserLite>>();

            try
            {
                // Get users from the async repository, rest of the code will be called after the async repository is completed as callback function
                response = await _userRepository.GetUsers(filter, pageNo, pageSize);
                // Set the success flag of the response object
                response.Status.Success = true;
                response.Status.Message = "Reviewers retrieved";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status.Success = false;
                response.Status.Message = ex.Message + Environment.NewLine + ex.InnerException?.Message;
                return BadRequest(response);
            }
        }

        //[Authorize] -> this one should be added once we got users account and have a way to authentication and authorization
        [Produces("application/json")]
        [HttpPost]
        public async Task<ActionResult<Response<Guid>>> Create([FromBody] UserCreate userCreate)
        {
            var response = new Response<Guid>()
            {
                Status = new Status { Success = true, Message = "Callback was created successfully" },
            };

            try
            {
                // there also will be a front-end check for the email, first_name or last_name
                // add them here for the best practice
                if (userCreate.email == null)
                {
                    response.Status.Message = "Email cannot be null";
                    response.Status.Success = false;
                    return BadRequest(response);
                }

                if (userCreate.first_name == null || userCreate.last_name == null)
                {
                    response.Status.Message = "First/Last name cannot be null";
                    response.Status.Success = false;
                    return BadRequest(response);
                }
                // Get users from the async repository, rest of the code will be called after the async repository is completed as callback function
                var result = await _userRepository.CreateUsers(userCreate);
                // id == null means there is a duplicated email in DB
                if (result.id == null)
                {
                    if (result.Message != null)
                        response.Status.Message = result.Message;
                    response.Status.Success = false;
                    return BadRequest(response);
                }
                response.Value = (Guid)result.id;
                return Ok(response);
            }
            catch (WebException ex)
            {
                var errorResponse = ex.Response;

                var errorText = "";
                using (var responseStream = errorResponse?.GetResponseStream())
                {
                    if (responseStream != null)
                    {
                        var reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));
                        errorText = reader.ReadToEnd();
                    }
                }

                response.Status.Success = false;
                response.Status.Message = $"{ex.Message} *** {errorText}";
                return BadRequest(response);
            }
        }
    }
}
