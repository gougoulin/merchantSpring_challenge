import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface OverdueOrder {
  marketplace: string;
  country: string;
  shopName: string;
  orderId: string;
  overdueDays: number;
  destination: string;
  items: number;
  orderValue: number;
}

enum SortOrder {
  RANDOM = "random",
  ASC = "asc",
  DESC = "desc",
}

const DataLine = styled.div`
  border-bottom: 1px solid #f0f0f2;
  display: flex;
  flex-direct: row;
  > p {
    width: 120px;
    font-size: 10px;
  }
`;

const HeaderLine = styled.div`
  font-family: "Roboto", sans-serif;
  background-color: #f5f6fa;
  font-size: 12px;
  display: flex;
  flex-direct: row;
  > p {
    width: 120px;
    font-size: 10px;
  }
`;

const DashboardWrapper = styled.div`
  width: 1000px;
  margin: auto;
  margin-top: 10vh;
  padding: 0;
  background-color: white;
  color: #282828;
  shadow: 10px 10px 5px #999;
`;

const HeaderWrapper = styled.div`
  padding: 10px 20px;
`;
const FooterWrapper = styled.div`
  height: 2rem;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 60px;
`;

const PageInput = styled.input`
  width: 20px;
  padding: 0 4px;
  margin: 0 10px;
`;

const Marketplace = styled.p`
  padding-left: 20px;

  > img {
    margin-right: 12px;
  }
`;
const Store = styled.p``;
const OrderId = styled.p``;
const OrderValue = styled.p`
  text-align: right;
`;
const Items = styled.p`
  text-align: center;
`;
const Destination = styled.p``;
const DaysOverdue = styled.p`
  text-align: center;
`;
const FooterButton = styled.button`
  border: 0;
  background-color: white;
  cursor: pointer;
  color: #777;
`;

interface Order {}

const Dashboard = () => {
  const [originalData, setOriginalData] = useState([]);
  const [overdueOrders, setOverdueOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState(0);
  const orders = [SortOrder.RANDOM, SortOrder.ASC, SortOrder.DESC];

  useEffect(() => {
    fetch("http://localhost:8080/sales")
      .then((response) => response.json())
      .then((out) => {
        setOriginalData(out.overdueOrders);
        setOverdueOrders(out.overdueOrders);
        setData(out.overdueOrders.slice(0, limit));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const lines = data.map((line: OverdueOrder) => {
    let orderValue = "" + (+line.orderValue).toFixed(2);
    return (
      <DataLine key={line.orderId}>
        <Marketplace>
          <img src={process.env.PUBLIC_URL + `images/${line.country}.jpg`} />
          {line.marketplace}
        </Marketplace>
        <Store>{line.shopName}</Store>
        <OrderId>{line.orderId}</OrderId>
        <OrderValue>${orderValue}</OrderValue>
        <Items>{line.items}</Items>
        <Destination>{line.destination}</Destination>
        <DaysOverdue style={{ color: "red" }}>{line.overdueDays}</DaysOverdue>
      </DataLine>
    );
  });

  const maxPage = Math.round(overdueOrders.length / limit);
  const handleNextPage = () => {
    let newPage = currentPage + 1;
    if (newPage > maxPage) {
      console.log("Max page reached");
    } else {
      setCurrentPage(newPage);
      setData(overdueOrders.slice((newPage - 1) * limit, newPage * limit));
    }
  };
  const handlePrevPage = () => {
    let newPage = currentPage - 1;
    if (currentPage === 1) {
      console.log("First page reached.");
    } else {
      setCurrentPage(newPage);
      setData(overdueOrders.slice(newPage * limit, (newPage + 1) * limit));
    }
  };
  const handleLastPage = () => {
    setCurrentPage(maxPage);
    setData(overdueOrders.slice((maxPage - 1) * limit, maxPage * limit));
  };
  const handleFirstPage = () => {
    setCurrentPage(1);
    setData(overdueOrders.slice(0, limit));
  };
  const handlePage = (page: number) => {
    setCurrentPage(page);
    setData(overdueOrders.slice((page - 1) * limit, page * limit));
  };

  const handleInput = (e: any) => {
    const page = +e.target.value;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
      setData(overdueOrders.slice(page * limit, (page + 1) * limit));
    }
  };

  const handleSort = () => {
    let newOrder = (order + 1) % orders.length;
    setOrder(newOrder);
    switch (orders[newOrder]) {
      case SortOrder.RANDOM:
        setOverdueOrders(originalData);
        setCurrentPage(1);
        setData(originalData.slice(0, limit));
        break;
      case SortOrder.ASC:
        let ascData = [...overdueOrders].sort(
          (left: OverdueOrder, right: OverdueOrder) => {
            return left.overdueDays - right.overdueDays;
          }
        );
        setOverdueOrders(ascData);
        setCurrentPage(1);
        setData(ascData.slice(0, limit));
        break;
      case SortOrder.DESC:
        let descData = [...overdueOrders].sort(
          (left: OverdueOrder, right: OverdueOrder) => {
            return right.overdueDays - left.overdueDays;
          }
        );
        setOverdueOrders(descData);
        setCurrentPage(1);
        setData(descData.slice(0, limit));
        break;
      default:
        break;
    }
  };

  return (
    <DashboardWrapper>
      <HeaderWrapper>Overdue Orders</HeaderWrapper>
      <HeaderLine>
        <Marketplace>MARKETPLACE</Marketplace>
        <Store>STORE</Store>
        <OrderId>ORDER ID</OrderId>
        <OrderValue>ORDER VALUE</OrderValue>
        <Items>ITEMS</Items>
        <Destination>DESTINATION</Destination>
        <DaysOverdue style={{ display: "flex", flexDirection: "row" }}>
          DAYS OVERDUE
          <img
            onClick={handleSort}
            style={{
              height: "10px",
              marginLeft: "2px",
              cursor: "pointer",
            }}
            src={process.env.PUBLIC_URL + `images/${orders[order]}.png`}
          />
        </DaysOverdue>
      </HeaderLine>
      {lines}
      <FooterWrapper>
        <FooterButton onClick={handleFirstPage}>&lt;&lt;</FooterButton>
        <FooterButton onClick={handlePrevPage}>&lt;</FooterButton>
        <FooterButton>Page</FooterButton>
        <PageInput value={currentPage} onChange={handleInput} />
        <FooterButton
          onClick={() => {
            handlePage(currentPage + 1);
          }}
        >
          {currentPage === maxPage ? maxPage : currentPage + 1}
        </FooterButton>
        <FooterButton onClick={handleNextPage}>&gt;</FooterButton>
        <FooterButton onClick={handleLastPage}>&gt;&gt;</FooterButton>
      </FooterWrapper>
    </DashboardWrapper>
  );
};

export default Dashboard;
