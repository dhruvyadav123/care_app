import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { API_URL, BASE_URL } from "../../Config/AppConstant";
import {
  MdCategory,
  MdEventAvailable,
  MdGroups,
  MdInsights,
  MdLocalHospital,
  MdPeople,
} from "react-icons/md";
import { FaStore, FaUserMd } from "react-icons/fa";

const cardTheme = [
  { bg: "linear-gradient(135deg, #6c63ff 0%, #7f7cff 100%)", iconBg: "rgba(255,255,255,0.22)" },
  { bg: "linear-gradient(135deg, #37c8f4 0%, #5ed7ff 100%)", iconBg: "rgba(255,255,255,0.22)" },
  { bg: "linear-gradient(135deg, #46d39a 0%, #69e1b1 100%)", iconBg: "rgba(255,255,255,0.22)" },
  { bg: "linear-gradient(135deg, #e5c34f 0%, #f1d56a 100%)", iconBg: "rgba(255,255,255,0.22)" },
  { bg: "linear-gradient(135deg, #ff7e86 0%, #ff9e8f 100%)", iconBg: "rgba(255,255,255,0.22)" },
  { bg: "linear-gradient(135deg, #8c62ff 0%, #b37bff 100%)", iconBg: "rgba(255,255,255,0.22)" },
];

const DashboardStats = () => {
  const [counts, setCounts] = useState(null);
  const [professionCategories, setProfessionCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rawLayout = localStorage.getItem("layout");
  const layout = rawLayout && rawLayout !== "undefined" ? rawLayout : "Admin";

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [countResult, categoryResult] = await Promise.allSettled([
          axios.get(`${API_URL}/admin/getAllCount`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/fitness/fitnessCategory`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (countResult.status === "fulfilled") {
          const countData = countResult.value?.data;
          if (countData?.success && countData?.counts) {
            setCounts(countData.counts);
          } else if (countData?.counts) {
            setCounts(countData.counts);
          } else if (countData && typeof countData === "object") {
            setCounts(countData);
          }
        }

        if (categoryResult.status === "fulfilled") {
          const categoryData = categoryResult.value?.data;
          const categories = Array.isArray(categoryData?.services)
            ? categoryData.services
            : Array.isArray(categoryData?.data)
            ? categoryData.data
            : Array.isArray(categoryData)
            ? categoryData
            : [];

          setProfessionCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const topCards = useMemo(() => {
    const liveCards = [
      {
        title: "Total Users",
        value: counts?.totalUsers ?? 0,
        note: "Registered users",
        icon: <MdPeople size={28} />,
        route: `/allUsers/${layout}`,
      },
      {
        title: "Active Vendors",
        value: counts?.totalVendors ?? 0,
        note: "Service providers",
        icon: <FaStore size={24} />,
        route: `/allVendors/${layout}`,
      },
      {
        title: "Doctors",
        value: counts?.totalDoctors ?? 0,
        note: "Verified doctors",
        icon: <FaUserMd size={24} />,
        route: `/doctor/${layout}`,
      },
      {
        title: "Communities",
        value: counts?.totalCommunities ?? 0,
        note: "Support groups",
        icon: <MdGroups size={28} />,
        route: `/community/${layout}`,
      },
      {
        title: "Events",
        value: counts?.totalEvents ?? 0,
        note: "Ongoing and upcoming",
        icon: <MdEventAvailable size={28} />,
        route: `/event/${layout}`,
      },
      {
        title: "Professions",
        value: professionCategories.length,
        note: "Available categories",
        icon: <MdCategory size={28} />,
        route: `/vender_category/${layout}`,
      },
    ];

    return liveCards.filter((item) => item.value > 0).length > 0 ? liveCards : [];
  }, [counts, professionCategories, layout]);

  const professionSeries = useMemo(() => {
    if (Array.isArray(counts?.vendorsByCategory) && counts.vendorsByCategory.length > 0) {
      return counts.vendorsByCategory
        .filter((item) => Number(item?.count) > 0)
        .slice(0, 6)
        .map((item, index) => ({
          id: item?._id || `profession-${index}`,
          name: item?.categoryName || item?.name || `Profession ${index + 1}`,
          count: Number(item?.count) || 0,
        }));
    }

    return professionCategories.slice(0, 6).map((item, index) => ({
      id: item?._id || `category-${index}`,
      name: item?.name || item?.categoryName || `Profession ${index + 1}`,
      count: 1,
    }));
  }, [counts, professionCategories]);

  const barChart = useMemo(() => {
    const labels = topCards.map((item) => item.title);
    const series = topCards.map((item) => item.value);

    return {
      series: [
        {
          name: "Count",
          data: series,
        },
      ],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false },
        },
        colors: ["#6c63ff", "#37c8f4", "#46d39a", "#e5c34f", "#ff7e86", "#8c62ff"],
        plotOptions: {
          bar: {
            columnWidth: "42%",
            distributed: true,
            borderRadius: 6,
          },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
          categories: labels,
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (value) => Math.round(value),
          },
        },
        grid: {
          borderColor: "#eef1f7",
          strokeDashArray: 4,
        },
        tooltip: {
          y: {
            formatter: (value) => `${value}`,
          },
        },
      },
    };
  }, [topCards]);

  const donutChart = useMemo(() => {
    return {
      series: professionSeries.map((item) => item.count),
      options: {
        chart: {
          type: "donut",
        },
        labels: professionSeries.map((item) => item.name),
        colors: ["#6c63ff", "#37c8f4", "#46d39a", "#e5c34f", "#ff7e86", "#8c62ff"],
        legend: {
          position: "bottom",
          onItemClick: {
            toggleDataSeries: false,
          },
          onItemHover: {
            highlightDataSeries: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 4,
          colors: ["#ffffff"],
        },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Professions",
                  formatter: () =>
                    `${professionSeries.reduce((sum, item) => sum + item.count, 0)}`,
                },
              },
            },
          },
        },
      },
    };
  }, [professionSeries]);

  const quickInsights = useMemo(() => {
    const totalUsers = counts?.totalUsers ?? 0;
    const totalVendors = counts?.totalVendors ?? 0;
    const totalDoctors = counts?.totalDoctors ?? 0;
    const totalCommunities = counts?.totalCommunities ?? 0;
    const totalEvents = counts?.totalEvents ?? 0;
    const totalProfessionExperts = professionSeries.reduce((sum, item) => sum + item.count, 0);

    const vendorUserRatio = totalUsers > 0 ? ((totalVendors / totalUsers) * 100).toFixed(1) : "0.0";
    const doctorUserRatio = totalUsers > 0 ? ((totalDoctors / totalUsers) * 100).toFixed(1) : "0.0";
    const communityEventMix = totalCommunities + totalEvents;

    return [
      {
        title: "Vendor Coverage",
        value: `${vendorUserRatio}%`,
        subtitle: "Vendors compared to users",
      },
      {
        title: "Doctor Reach",
        value: `${doctorUserRatio}%`,
        subtitle: "Doctors compared to users",
      },
      {
        title: "Profession Total",
        value: `${totalProfessionExperts}`,
        subtitle: "Mapped profession records",
      },
      {
        title: "Engagement Mix",
        value: `${communityEventMix}`,
        subtitle: "Communities and events together",
      },
    ];
  }, [counts, professionSeries]);

  const professionCards = useMemo(() => professionSeries.slice(0, 6), [professionSeries]);
  const getProfessionIcon = (profession) => {
    const matchedCategory = professionCategories.find(
      (item) =>
        item?._id === profession.id ||
        item?.name === profession.name ||
        item?.categoryName === profession.name
    );

    return matchedCategory?.categoryIcon
      ? `${BASE_URL}/uploads/${matchedCategory.categoryIcon}`
      : null;
  };
  const defaultFavicon = `${BASE_URL}/favicon.ico`;

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (topCards.length === 0 && professionCards.length === 0) {
    return <p className="text-danger text-center">No dashboard data available</p>;
  }

  return (
    <Row className="g-4">
      {topCards.map((card, index) => (
        <Col xl={4} lg={4} md={6} sm={12} key={card.title}>
          <Card
            className="border-0 h-100 cursor-pointer"
            onClick={() => navigate(card.route)}
            style={{
              background: cardTheme[index % cardTheme.length].bg,
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(17, 24, 39, 0.12)",
            }}
          >
            <CardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-white opacity-75 fw-medium mb-2">{card.title}</div>
                  <div className="text-white fw-bold" style={{ fontSize: "2rem", lineHeight: 1 }}>
                    {card.value}
                  </div>
                  <div className="text-white opacity-75 mt-2">{card.note}</div>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{
                    width: "54px",
                    height: "54px",
                    background: cardTheme[index % cardTheme.length].iconBg,
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}

      {topCards.length > 0 && (
        <Col xl={8} lg={12}>
          <Card className="border-0 h-100" style={{ borderRadius: "14px", boxShadow: "0 10px 30px rgba(17, 24, 39, 0.08)" }}>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-1">Overall Platform Performance</h5>
                  <p className="text-secondary mb-0">Live counts across the main healthcare modules</p>
                </div>
                <div className="text-primary">
                  <MdInsights size={28} />
                </div>
              </div>
              <ReactApexChart type="bar" height={320} series={barChart.series} options={barChart.options} />
            </CardBody>
          </Card>
        </Col>
      )}

      {professionSeries.length > 0 && (
        <Col xl={4} lg={12}>
          <Card className="border-0 h-100" style={{ borderRadius: "14px", boxShadow: "0 10px 30px rgba(17, 24, 39, 0.08)" }}>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-1">Profession Split</h5>
                  <p className="text-secondary mb-0">Distribution by vendor category</p>
                </div>
                <div className="text-success">
                  <MdLocalHospital size={28} />
                </div>
              </div>
              <ReactApexChart type="donut" height={320} series={donutChart.series} options={donutChart.options} />
            </CardBody>
          </Card>
        </Col>
      )}

      <Col xl={6} lg={12}>
        <Card className="border-0 h-100" style={{ borderRadius: "14px", boxShadow: "0 10px 30px rgba(17, 24, 39, 0.08)" }}>
          <CardBody>
            <div className="mb-4">
              <h5 className="mb-1">Professional Category Cards</h5>
              <p className="text-secondary mb-0">Real profession and category data from the project</p>
            </div>
            <Row className="g-3">
              {professionCards.map((profession, index) => (
                <Col md={6} key={profession.id}>
                  <div
                    role="button"
                    onClick={() => navigate(`/vender_category/${layout}`)}
                    className="h-100"
                    style={{
                      background: cardTheme[index % cardTheme.length].bg,
                      borderRadius: "14px",
                      padding: "18px",
                      color: "#ffffff",
                      minHeight: "128px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold mb-2">{profession.name}</div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                          {profession.count}
                        </div>
                        <div className="opacity-75 mt-2">category records</div>
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "46px",
                          height: "46px",
                          background: "rgba(255,255,255,0.22)",
                        }}
                      >
                        {getProfessionIcon(profession) ? (
                          <img
                            src={getProfessionIcon(profession)}
                            alt={profession.name}
                            style={{ width: 24, height: 24, objectFit: "cover", borderRadius: "6px" }}
                          />
                        ) : (
                          <img
                            src={defaultFavicon}
                            alt="favicon"
                            style={{ width: 24, height: 24, objectFit: "contain", borderRadius: "6px" }}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              event.currentTarget.nextSibling.style.display = "block";
                            }}
                          />
                        )}
                        <span style={{ display: "none" }}>
                          <MdCategory size={24} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      </Col>

      <Col xl={6} lg={12}>
        <Card className="border-0 h-100" style={{ borderRadius: "14px", boxShadow: "0 10px 30px rgba(17, 24, 39, 0.08)" }}>
          <CardBody>
            <div className="mb-4">
              <h5 className="mb-1">Dashboard Insights</h5>
              <p className="text-secondary mb-0">Live ratios and summary values from the current project data</p>
            </div>
            <Row className="g-3">
              {quickInsights.map((item, index) => (
                <Col md={6} key={item.title}>
                  <div
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #eef1f7",
                      padding: "20px",
                      background: index % 2 === 0 ? "#f8faff" : "#ffffff",
                    }}
                  >
                    <div className="text-secondary mb-2">{item.title}</div>
                    <div className="fw-bold text-dark" style={{ fontSize: "1.8rem", lineHeight: 1 }}>
                      {item.value}
                    </div>
                    <div className="text-secondary mt-2">{item.subtitle}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
