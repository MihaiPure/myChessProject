using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace myChessProject.Models
{
    public class GameSession
    {
        // game id
        public int Id { get; set; }

        // fen position of the game (in progress or ended)
        public string Fen { get; set; }

        // user ID for player 1 from AspNetUser table
        public string UserId1 { get; set; }

        // user ID for player 2 from AspNetUser table
        public string UserId2 { get; set; }

        // date and time of the game
        public DateTime Date { get; set; }

    }

    public class GameSessionDbContext : DbContext
    {
        public GameSessionDbContext() : base("DefaultConnection") { }
        public DbSet<GameSession> GameSessions { get; set; }
    }
}