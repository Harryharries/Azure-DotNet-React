﻿namespace DataAccessLayer.Dto
{
    public class UserLite
    {
        public Guid id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }
        public DateTime date_created { get; set; }
    }
}
