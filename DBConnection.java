import java.sql.*;
public class DBConnection {
    public static void main(String[] args) {
        // Database URL, username and password
        String url = "jdbc:mysql://localhost:3306/DS20db";
        String user = "root";
        String password = "student";

        Connection conn = null;
//        Statement selectStmt = null;
        ResultSet rs = null;

        try {
            // Load the MySQL JDBC driver (optional for newer versions)
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish connection
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Database connection successfully");


//            // Select and display all records
//            String selectSQL = "SELECT * FROM StudentDB";
//            selectStmt = conn.createStatement();
//            rs = selectStmt.executeQuery(selectSQL);
//
//            System.out.println("Student Records:");
//            while (rs.next()) {
//                String name = rs.getString("name");
//                String rollNo = rs.getString("rollno");
//                System.out.println("Name: " + name + ", Roll No: " + rollNo);
//            }

        } catch (ClassNotFoundException e) {
            System.out.println("MySQL JDBC Driver not found.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("SQL Error:");
            e.printStackTrace();
        } finally {
            // Close resources in reverse order of opening
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
//            try { if (selectStmt != null) selectStmt.close(); } catch (SQLException e) { e.printStackTrace();}
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
}