namespace DataAccessLayer.Dto
{
    public class Response<T>
    {
        public Status Status { get; set; } = new Status();
        public T Value { get; set; }
        public Response()
        {
            Status.Success = false;
            Status.Message = "Response object was initialized but never updated";
        }

        public void Success(string message)
        {
            Status.Success = true;
            Status.Message = message != "" ? message : "Success";
        }
    }

    public class PaginatedResponse<T> : Response<T>
    {
        public int TotalCount { get; set; }
    }
}
