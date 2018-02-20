
package sa45.angular.giphy;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.ws.rs.core.MediaType;

@WebServlet(name = "AccountServlet", urlPatterns = {"/account/*"})
public class AccountServlet extends HttpServlet {
    
    @Resource(lookup="jdbc/giphy")
    private DataSource connPool;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        System.out.println(">>>>path info: " + request.getPathInfo());
        String userEmail = request.getPathInfo().substring(1);
        int count = 0;
        JsonObjectBuilder resultBuilder = Json.createObjectBuilder();
        JsonArrayBuilder imgBuilder = Json.createArrayBuilder();
        
        try (Connection conn = connPool.getConnection()) {
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM giphy.userImage where userEmail=?");
            ps.setString(1, userEmail);
            ResultSet rs = ps.executeQuery();
           
            while (rs.next()){
                JsonObject item = Json.createObjectBuilder()
                        .add("id", rs.getString("id"))
                        .add("url", rs.getString("url"))
                        .build();
                imgBuilder.add(item);
                count ++;
                System.out.println("Number: " + count );
            }
            rs.close();
            
        } catch (SQLException ex) {
            //throw new IOException(ex);
            log(ex.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        
        try(PrintWriter out = response.getWriter()){
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType(MediaType.APPLICATION_JSON);
            out.println(resultBuilder.add("images", imgBuilder)
                    .add("count", count)
                    .build().toString());       
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(AccountServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(AccountServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
