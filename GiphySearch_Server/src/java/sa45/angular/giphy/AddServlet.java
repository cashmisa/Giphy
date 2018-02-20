/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sa45.angular.giphy;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Xiaowen
 */
@WebServlet(name = "AddServlet", urlPatterns = {"/add"})
public class AddServlet extends HttpServlet {

    @Resource(lookup="jdbc/giphy")
    private DataSource connPool;
    
    private String userEmail, id , url;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine())!= null){
                jb.append(line);
            }
        } catch (Exception e) {
            
        }
        try {
            JSONObject jsonObj = new JSONObject(jb.toString());
            userEmail = jsonObj.getString("userEmail");
            id = jsonObj.getString("id");
            url = jsonObj.getString("url");
            System.out.println(">>>>>>>>>>" + userEmail + id + url);
        } catch (JSONException e) {
            throw new IOException("Error parsing JSON request string");
        }
          
        JsonArrayBuilder imgBuilder = Json.createArrayBuilder();
        
        try (Connection conn = connPool.getConnection()) {
            
            Statement stmt = conn.createStatement();
            
            PreparedStatement ps = conn.prepareStatement("INSERT INTO giphy.userImage VALUES(?, ?, ?)");
            ps.setString(1, userEmail);
            ps.setString(2, id);
            ps.setString(3, url);
            ps.execute();
           
            conn.close();
            
        } catch (SQLException ex) {
            //throw new IOException(ex);
            log(ex.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        System.out.println("going to account/list");
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(AddServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(AddServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
