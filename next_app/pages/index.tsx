/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Header from "../components/Header";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "../components/fire";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export default function Home(): JSX.Element {
  const mydata: any[] | (() => any[]) = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [loginState, setLoginState] = useState("Login");
  const [user, setUser] = useState("");

  const [data, setData] = useState(mydata);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [currentDate, setCurrentDate] = useState(0);
  const [memo, setMemo] = useState("");
  const [memoExist, setMemoExist] = useState(false);
  const [show, setShow] = useState(false);

  useEffect((): void => {
    if (auth.currentUser != null) {
      setLoginState("Logout");
      setUser(auth.currentUser.displayName!);
      db.collection("mydata")
        .doc(auth.currentUser.email!)
        .collection("memo")
        .get()
        .then((snapshot): void => {
          snapshot.forEach((document): void => {
            const doc = document.data();
            mydata.push(doc);
          });
          setData(mydata);
        });
    }
  }, [user, show]);

  const login = (): void => {
    auth
      .signInWithPopup(provider)
      .then((result): void => {
        if (result.user !== null) {
          setLoginState("Logout");
          setUser(`logined: ${result.user.displayName}`);
        }
      })
      .catch((_error): void => {
        setUser("not logined.");
      });
  };

  const logout = (): void => {
    auth.signOut();
    setLoginState("Login");
    setUser("");
  };

  const doLogin = (): void => {
    if (auth.currentUser == null) {
      login();
    } else {
      logout();
    }
  };

  const currentYMD = (e: number): string => {
    const yyyy = String(year);
    const mm = ("0" + String(month + 1)).slice(-2);
    const dd = ("0" + String(e)).slice(-2);
    return yyyy + mm + dd;
  };

  const findMemo = (date: number): boolean => {
    const foundData = data.find(
      (obj: { memo: string; date: string }): boolean => {
        return currentYMD(date) === obj.date;
      }
    );
    return foundData ? true : false;
  };

  const showMemo = (date: number): any => {
    const foundData = data.find(
      (obj: { memo: string; date: string }): boolean => {
        return currentYMD(date) === obj.date;
      }
    );
    return foundData ? foundData.memo : "";
  };

  function sendOneMonth(n: number): () => void {
    // この処理の意味は現時点で不明……
    return (): void => {
      const adjacentMonth = month + n;
      if (11 < adjacentMonth) {
        setMonth(0);
        setYear(year + 1);
      } else if (adjacentMonth < 1) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(adjacentMonth);
      }
    };
  }

  const jumpToCurrentMonth = (): (() => void) => {
    return (): void => {
      setYear(currentYear);
      setMonth(currentMonth);
    };
  };

  const doChange = (e: any): void => {
    setMemo(e.target.value);
  };

  const doAdd = (): void => {
    const ob = { memo: memo, date: currentYMD(currentDate) };
    if (auth.currentUser != null) {
      db.collection("mydata")
        .doc(auth.currentUser.email!)
        .collection("memo")
        .add(ob)
        .then((): void => handleClose());
    }
  };

  const doDelete = (): void => {
    if (auth.currentUser != null) {
      db.collection("mydata")
        .doc(auth.currentUser.email!)
        .collection("memo")
        .where("date", "==", currentYMD(currentDate))
        .get()
        .then((snapshot): void => {
          snapshot.forEach((document): void => {
            document.ref.delete().then((): void => handleClose());
          });
        });
    }
  };

  const handleOpen = (date: number): void => {
    if (findMemo(date) === true) {
      setMemoExist(true);
    }
    setCurrentDate(date);
    setShow(true);
  };

  const handleClose = (): void => {
    if (memoExist === true) {
      setMemoExist(false);
    }
    setShow(false);
  };

  const dayOfWeekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarGenerator = (
    year: number,
    month: number
  ): (number | "")[][] => {
    const monthBeginningWeekday = new Date(year, month, 1).getDay(); // 月初の曜日
    const monthEndDate = new Date(year, month + 1, 0).getDate(); // 月末の日付

    return [0, 1, 2, 3, 4, 5].map((calRowIndex): (number | "")[] => {
      return [0, 1, 2, 3, 4, 5, 6].map((calColumnIndex): number | "" => {
        const date =
          calColumnIndex + 1 + calRowIndex * 7 - monthBeginningWeekday; // 月初以前は０以下の数になる
        return date < 1 || monthEndDate < date ? "" : date;
      });
    });
  };

  const calendarBody = calendarGenerator(year, month);

  return (
    <div>
      <Header />

      <Navbar bg="primary" variant="dark">
        <Navbar.Brand>️📅 メモのできるカレンダー</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>{user}</Navbar.Text>
          <Button variant="outline-light" onClick={doLogin}>
            {loginState}
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <h4 className="my-3" style={{ textAlign: "center" }}>{`${year}年${
        month + 1
      }月`}</h4>

      <ButtonGroup>
        <Button variant="secondary" onClick={sendOneMonth(-1)}>
          Prev
        </Button>
        <Button variant="secondary" onClick={jumpToCurrentMonth()}>
          Today
        </Button>
        <Button variant="secondary" onClick={sendOneMonth(1)}>
          Next
        </Button>
      </ButtonGroup>

      <Container fluid>
        <Row>
          <Table className="my-3" bordered>
            <thead>
              <tr>
                {dayOfWeekArray.map(
                  (day, index): JSX.Element => (
                    <th key={index} align="center">
                      {day}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {calendarBody.map((week, i): JSX.Element => {
                return (
                  <tr key={week.join("")}>
                    {week.map((date, j): JSX.Element => {
                      return (
                        <td key={`${i}${j}`}>
                          {date ? (
                            <Button
                              variant={findMemo(date) ? "info" : "light"}
                              onClick={
                                (): void =>
                                  handleOpen(
                                    date
                                  ) /* この実行方法でないと無限ループが起きる */
                              }
                            >
                              {date}
                            </Button>
                          ) : (
                            ""
                          )}
                          <p className="d-none d-xl-block">
                            {date ? showMemo(date) : ""}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{`${year}/${
            month + 1
          }/${currentDate}のメモ`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {memoExist === true ? (
            <p>{showMemo(currentDate)}</p>
          ) : (
            <Form>
              <Form.Group>
                <Form.Label>新規登録</Form.Label>
                <Form.Control type="text" onChange={doChange} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {memoExist === false ? (
            <Button variant="primary" onClick={doAdd}>
              Add
            </Button>
          ) : (
            <Button variant="danger" onClick={doDelete}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
