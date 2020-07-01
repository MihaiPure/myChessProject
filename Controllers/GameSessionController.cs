using myChessProject.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace myChessProject.Controllers
{
    public class GameSessionController : Controller
    {
        private GameSessionDbContext db = new GameSessionDbContext();

        // GET: GameSession
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult New()
        {
            return View();
        }

        [HttpPost]
        public ActionResult New(GameSession gs)
        {
            var controller = DependencyResolver.Current.GetService<HelperController>();
            controller.ControllerContext = new ControllerContext(this.Request.RequestContext, controller);
            string opponent = controller.PairUsers(gs.UserId1);
            Debug.WriteLine(gs.UserId1);
            Debug.WriteLine(opponent);
            if (opponent == null)
            {
                // search the active game pool for your game
                foreach(var activeGameSession in db.GameSessions)
                {
                    if(activeGameSession.UserId1 == gs.UserId1 || activeGameSession.UserId2 == gs.UserId1)
                    {
                        return RedirectToAction("Show", new { id = activeGameSession.Id });
                    }
                }
                // else erorr
                ViewBag.warning = "No opponent has been found at this time. Please try again";
                return View();
            }
            else
            {
                //add game to db and change view
                try
                {
                    gs.UserId2 = opponent;
                    db.GameSessions.Add(gs);
                    db.SaveChanges();
                    // add gameSession to active game pool

                    return RedirectToAction("Show", new { id = gs.Id });

                } catch (Exception e)
                {
                    return View();
                }
            }
        }

        public ActionResult Show(int id)
        {
            GameSession gs = db.GameSessions.Find(id);
            ViewBag.gs = gs;
            return View();
        }

        [Authorize]
        public ActionResult Computer()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UpdateBoard(GameSession gs)
        {

            return View();
        }
    }
}