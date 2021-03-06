package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.text.*;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

/** Servlet that deletes all comment entries from datastore */
@WebServlet("/delete-data")
public class DeleteServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query commentsQuery = new Query("Comment");
    Query replyQuery = new Query("Reply");
    PreparedQuery commentsResults = datastore.prepare(commentsQuery);
    PreparedQuery replyResults = datastore.prepare(replyQuery);
    
    // Deletes all comments.
    for (Entity entity : commentsResults.asIterable()) {
      datastore.delete(entity.getKey());
      System.out.println("deleted" + entity.getKey());
    }

    // Deletes all replies.
    for (Entity entity : replyResults.asIterable()) {
      datastore.delete(entity.getKey());
      System.out.println("deleted" + entity.getKey());
    }

    System.out.println("DELETE COMPLETED");
    response.sendRedirect("/forum.html");
  }
}
