using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Diagnostics;
using System.Data.SqlClient;
using System.Configuration;
using System.Threading;

namespace myChessProject.Controllers
{
    public class HelperController : Controller
    {
        public List<string> playerIdPool;
        public DbContext Context = new DbContext("DBConnectionString");
        public DbSet<string> ActivePlayers { get; set; }


        public string FindOpponent(string userId)
        {
            using (SqlConnection connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                var query = "SELECT userId FROM ActivePlayers";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    Debug.WriteLine("connection open");

                    using (var reader = command.ExecuteReader())
                    {
                        var userIds = new List<string>();
                        while (reader.Read())
                        {
                            userIds.Add(reader["userId"].ToString());
                        }
                        foreach (var id in userIds)
                        {
                            if (id != userId)
                            {
                                return id;
                            }
                        }

                    }

                }
                Debug.WriteLine("connection closed");
            }
            return null;
        }

        public void RemoveUser(string userId)
        {
            using (SqlConnection connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                bool shouldDelete = false;
                var query = "SELECT userId FROM ActivePlayers";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    Debug.WriteLine("connection open");

                    using (var reader = command.ExecuteReader())
                    {
                        var userIds = new List<string>();
                        while (reader.Read())
                        {
                            userIds.Add(reader["userId"].ToString());
                        }

                        foreach (var id in userIds)
                        {
                            if (id == userId)
                            {
                                shouldDelete = true;
                            }
                        }
                    }
                }
                if (shouldDelete)
                {
                    var deleteQuery = "DELETE FROM ActivePlayers WHERE UserId = '" + userId + "';";
                    using (SqlCommand deleteCommand = new SqlCommand(deleteQuery, connection))
                    {
                        Debug.WriteLine("deleting...");
                        using (var deleteReader = deleteCommand.ExecuteReader())
                        {
                            var deleteResult = deleteReader.Read();
                            Debug.WriteLine(deleteResult);
                        }
                    }
                }
                Debug.WriteLine("connection closed");
            }
        }

        public List<string> GetActiveUserIds()
        {
            using (SqlConnection connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                var query = "SELECT userId FROM ActivePlayers";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    Debug.WriteLine("connection open");

                    using (var reader = command.ExecuteReader())
                    {
                        var userIds = new List<string>();
                        while (reader.Read())
                        {
                            userIds.Add(reader["userId"].ToString());
                        }
                        return userIds;
                    }
                }
                Debug.WriteLine("connection closed");
            }
            // If we got this far, something went wrong
            return null;
        }

        public void AddUserToPool(string userId)
        {
            bool shouldAdd = true;
            using (SqlConnection connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                var query = "SELECT userId FROM ActivePlayers";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    Debug.WriteLine("connection open");

                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        var userIds = new List<string>();
                        while (reader.Read())
                        {
                            userIds.Add(reader["userId"].ToString());
                        }
                        foreach (var currId in userIds)
                        {
                            Debug.WriteLine(currId);
                            if (currId == userId)
                            {
                                shouldAdd = false;
                                Debug.WriteLine("Did not add because it already exists");
                            }
                        }
                    }
                }
                if (shouldAdd)
                {
                    var insertQuery = "INSERT INTO ActivePlayers (\"UserId\") VALUES ('" + userId + "');";
                    using (SqlCommand insertCommand = new SqlCommand(insertQuery, connection))
                    {
                        Debug.WriteLine("inserting...");
                        using (var insertReader = insertCommand.ExecuteReader())
                        {
                            var insertResult = insertReader.Read();
                            Debug.WriteLine(insertResult);
                        }
                    }
                }
                Debug.WriteLine("connection closed");
            }
        }

        public string PairUsers(string userId)
        {
            string opponent = null;

            this.AddUserToPool(userId);
            var timeSpan = TimeSpan.FromSeconds(10);
            var thread = new Thread(() =>
            {
                Thread.Sleep(10000);
                Debug.WriteLine("timeout");
            });
            thread.Start();
            while (opponent == null && thread.IsAlive)
            {
                opponent = FindOpponent(userId);
            }

            this.RemoveUser(userId);
            this.RemoveUser(opponent);

            return opponent;
        }

    }
}