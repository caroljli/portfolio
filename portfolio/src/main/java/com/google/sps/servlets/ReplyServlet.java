package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.text.*;
import com.google.sps.data.Comment;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

@WebServlet("/reply-data")
public class ReplyServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query commentQuery = new Query("Comment");
    Query replyQuery = new Query("Reply");

    PreparedQuery commentResults = datastore.prepare(commentQuery);
    PreparedQuery replyResults = datastore.prepare(replyQuery);

    List<Comment> replies = new ArrayList<>();

    for (Entity entity : replyResults.asIterable()) {
      long id = entity.getKey().getId();
      String name = entity.getProperty("name").toString();
      String comment = entity.getProperty("comment").toString();
      String email = entity.getProperty("email").toString();
      String date = entity.getProperty("date").toString();
      long parentId = Long.parseLong(entity.getProperty("parentId").toString());

      // Creates new reply, with an empty String value for location.
      Comment fullReplyComment = new Comment(id, name, comment, email, date, "", parentId);

      replies.add(fullReplyComment);
    }
    
    Gson gson = new Gson();
    String repliesJson = gson.toJson(replies);
    
    response.setContentType("application/json;");
    response.getWriter().println(repliesJson);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    SimpleDateFormat ft = new SimpleDateFormat("E MMMM dd yyyy '@' hh:mm a zzz");
    
    String name = request.getParameter("name");
    String comment = request.getParameter("comment");
    String email = request.getParameter("email");
    Date dateRaw = new Date();
    String date = ft.format(dateRaw).toString();
    String parentId = request.getParameter("parent-id");

    Entity replyEntity = new Entity("Reply");
    replyEntity.setProperty("name", name);
    replyEntity.setProperty("comment", comment);
    replyEntity.setProperty("email", email);
    replyEntity.setProperty("date", date);
    replyEntity.setProperty("parentId", parentId);

    datastore.put(replyEntity);

    response.sendRedirect("/forum.html");
  }
}
