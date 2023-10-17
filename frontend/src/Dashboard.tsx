import { Link } from "react-router-dom";
import logo from "./assets/Revendo_logo.png";
import profile1 from "./assets/profile-1.jpg";
import profile2 from "./assets/profile-2.jpg";
import profile3 from "./assets/profile-3.jpg";
import "./css/Dashboard.css";

import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleMenuClick = () => {
    setIsSideMenuOpen(true);
  };

  const handleCloseClick = () => {
    setIsSideMenuOpen(false);
  };

  const handleThemeToggleClick = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Inside your React component
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark-theme-variables");
    } else {
      document.body.classList.remove("dark-theme-variables");
    }
  }, [isDarkTheme]);

  return (
    <div className="container">
      <aside style={{ height: isSideMenuOpen ? "100vh" : "0vh" }}>
        <div className="top">
          <div className="logo">
            <img src={logo} alt="Revendo Logo" />
            <h2>ReVendo</h2>
          </div>
          <div className="close" id="close-btn" onClick={handleCloseClick}>
            <span className="material-symbols-sharp"> close </span>
          </div>
        </div>
        <div className="sidebar">
          <a href="#">
            <span className="material-symbols-sharp"> dashboard </span>
            <h3>Dashboard</h3>
          </a>
          <a href="#">
            <span className="material-symbols-sharp"> person </span>
            <h3>Customers</h3>
          </a>
          <a href="#">
            <span className="material-symbols-sharp"> receipt_long </span>
            <h3>Orders</h3>
          </a>
          <a href="#" className="active">
            <span className="material-symbols-sharp"> insights </span>
            <h3>Analytics</h3>
          </a>
          <a href="#">
            <span className="material-symbols-sharp"> mail_outline </span>
            <h3>Messages</h3>
            <span className="message-count">25</span>
          </a>
          <a href="#">
            <span className="material-symbols-sharp"> inventory </span>
            <h3>Products</h3>
          </a>
          <a href="#">
            <span className="material-symbols-sharp"> settings </span>
            <h3>Settings</h3>
          </a>
          <a href="#">
            <span className="material-symbols-sharp">
              {" "}
              report_gmailerrorred{" "}
            </span>
            <h3>Report</h3>
          </a>
          <a href="#">
            <span className="material-symbols-sharp"> add </span>
            <h3>Add Product</h3>
          </a>
          <Link to={"/"}>
            <span className="material-symbols-sharp"> logout </span>
            <h3>Logout</h3>
          </Link>
        </div>
      </aside>
      {/* End of Aside */}
      <main>
        <h1>Dashboard</h1>

        <div className="insights">
          <div className="sales">
            <span className="material-symbols-sharp"> monitoring </span>
            <div className="middle">
              <div className="left">
                <h3>Total Sales</h3>
                <h1>P25,034</h1>
              </div>
              <div className="progress">
                <svg>
                  <circle cx={38} cy={38} r={36} />
                </svg>
                <div className="number">
                  <p>81%</p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
          {/* End of Sales */}
          <div className="expenses">
            <span className="material-symbols-sharp"> bar_chart </span>
            <div className="middle">
              <div className="left">
                <h3>Total Expenses</h3>
                <h1>P45,421</h1>
              </div>
              <div className="progress">
                <svg>
                  <circle cx={38} cy={38} r={36} />
                </svg>
                <div className="number">
                  <p>58%</p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
          {/* End of Expenses */}
          <div className="income">
            <span className="material-symbols-sharp"> stacked_line_chart </span>
            <div className="middle">
              <div className="left">
                <h3>Total Income</h3>
                <h1>P67,423</h1>
              </div>
              <div className="progress">
                <svg>
                  <circle cx={38} cy={38} r={36} />
                </svg>
                <div className="number">
                  <p>68%</p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
          {/* End of Income */}
        </div>
        {/* End of Insights */}
        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Number</th>
                <th>Payment</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {/* <tr>
          <td>Foldable Mini Drone</td>
          <td>646544</td>
          <td>Due</td>
          <td class="warning">Pending</td>
          <td class="primary">Details</td>
        </tr> */}
            </tbody>
          </table>
          <a href="#">Show All</a>
        </div>
      </main>
      {/* End of Main */}
      <div className="right">
        <div className="top">
          <button id="menu-btn" onClick={handleMenuClick}>
            <span className="material-symbols-sharp"> menu </span>
          </button>
          <div
            className={`theme-toggler ${
              isDarkTheme ? "dark-theme-variables" : ""
            }`}
            onClick={handleThemeToggleClick}
          >
            <span className="material-symbols-sharp active"> light_mode </span>
            <span className="material-symbols-sharp"> dark_mode </span>
          </div>
          <div className="profile">
            <div className="info">
              <p>
                Hey, <b>Jasper</b>
              </p>
              <small className="text-muted">Admin</small>
            </div>
            <div className="profile-photo">
              <img src={profile1} alt="" />
            </div>
          </div>
        </div>
        {/* End of Top */}
        <div className="recent-updates">
          <h2>Recent Updates</h2>
          <div className="updates">
            <div className="update">
              <div className="profile-photo">
                <img src={profile1} alt="" />
              </div>
              <div className="message">
                <p>
                  <b>Mike Tyson</b> received his order of Night Lion tech GPS
                  drone.
                </p>
                <small className="text-muted">2 Minutes Ago</small>
              </div>
            </div>
            <div className="update">
              <div className="profile-photo">
                <img src={profile2} alt="" />
              </div>
              <div className="message">
                <p>
                  <b>Mike Tyson</b> received his order of Night Lion tech GPS
                  drone.
                </p>
                <small className="text-muted">2 Minutes Ago</small>
              </div>
            </div>
            <div className="update">
              <div className="profile-photo">
                <img src={profile3} alt="" />
              </div>
              <div className="message">
                <p>
                  <b>Mike Tyson</b> received his order of Night Lion tech GPS
                  drone.
                </p>
                <small className="text-muted">2 Minutes Ago</small>
              </div>
            </div>
          </div>
        </div>
        {/* End of Recent Updates */}
        <div className="sales-analytics">
          <h2>Sales Analytics</h2>
          <div className="item offline">
            <div className="icon">
              <span className="material-symbols-sharp"> local_mall </span>
            </div>
            <div className="right">
              <div className="info">
                <h3>OFFLINE ORDERS</h3>
                <small className="text-muted">Last 24 Hours</small>
              </div>
              <h5 className="danger">-24%</h5>
              <h3>1100</h3>
            </div>
          </div>
          <div className="item online">
            <div className="icon">
              <span className="material-symbols-sharp"> shopping_cart </span>
            </div>
            <div className="right">
              <div className="info">
                <h3>ONLINE ORDERS</h3>
                <small className="text-muted">Last 24 Hours</small>
              </div>
              <h5 className="success">+39%</h5>
              <h3>3849</h3>
            </div>
          </div>
          <div className="item customers">
            <div className="icon">
              <span className="material-symbols-sharp"> person </span>
            </div>
            <div className="right">
              <div className="info">
                <h3>NEW CUSTOMERS</h3>
                <small className="text-muted">Last 24 Hours</small>
              </div>
              <h5 className="success">+25%</h5>
              <h3>849</h3>
            </div>
          </div>
          <div className="item add-product">
            <div>
              <span className="material-symbols-sharp"> add </span>
              <h3>Add Product</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
