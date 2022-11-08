import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@material-ui/core/Container/Container";
import Button from "@material-ui/core/Button/Button";
import { ArrowForward, Router } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";

import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { getLowerCaseLetter, getUpperCaseLetter } from "../utils/utils";

const GrammarInput = ({ grammar, leftSide, rightSide, cont }) => {
  const [inputs, setInputs] = useState([leftSide, rightSide]);

  return (
    <div style={styles.item}>
      <input
        value={inputs[0]}
        style={styles.input2}
        onChange={(e) => {
          setInputs([e.target.value.toUpperCase(), inputs[1]]);
          grammar[cont].leftSide = e.target.value.toUpperCase();
          grammar[cont].rightSide = inputs[1];
        }}
        maxLength={1}
        placeholder="LHS"
      />

      <ArrowForward color="action" />

      <input
        id={cont}
        value={inputs[1]}
        style={styles.input}
        onChange={(e) => {
          setInputs([inputs[0], e.target.value]);
          grammar[cont].leftSide = inputs[0];
          grammar[cont].rightSide = e.target.value;
        }}
        placeholder="RHS"
      />

      <Tooltip title="Adicionar caractere vazio: λ">
        <Button
          id={cont}
          style={styles.button}
          onClick={(e) => {
            const buttonId = e.currentTarget.getAttribute("id");
            const textarea = document.getElementById(buttonId);

            let value = textarea.value;
            if (value.length === 0) textarea.value = "λ";
            else textarea.value = value + " | λ";
            grammar[cont].rightSide = textarea.value;
          }}
        >
          <p style={{ color: "#757575" }}>λ</p>
        </Button>
      </Tooltip>
    </div>
  );
};

export default function Gramatica() {
  let cont = 0;
  const navigate = useNavigate();
  const [grammarInputs, setGrammarInputs] = useState([
    { leftSide: "S", rightSide: "aS | abB | B" },
    { leftSide: "B", rightSide: "cB | λ" },
  ]);
  const [inputs, setInputs] = useState([1]);
  const validate = (strInput) => {
    const str = strInput.target.value;
    const arr = grammarInputs.map((input) => {
      const temp = { ...input };
      temp.rightSide = temp.rightSide.replace(/\s+/g, "").split("|");
      return temp;
    });
    const res = [];
    let type = "";
    arr.forEach((row) => {
      row.rightSide.forEach((rule) => {
        if (rule.length > 1) {
          if (rule.replace(/[^A-Z]/g, "").length > 1) {
            res.push("Invalid");
          } else {
            for (let i = 0; i < rule.length; i++) {
              if (rule[i] === rule[i].toUpperCase() && i === 0) {
                res.push("Left");
                break;
              }
              if (rule[i] === rule[i].toUpperCase() && i === rule.length - 1) {
                res.push("Right");
                break;
              }
            }
          }
        }
      });
    });

    //console.log(res);

    if (res.filter((s) => s === "Right").length === res.length) {
      type = "Right";
    } else if (res.filter((s) => s === "Left").length === res.length) {
      type = "Left";
    } else {
      type = "Invalid";
    }
    //console.log('String: ', str);

    if (type === "Right") {
      //console.log('Grammar type: ', type);

      for (let rule of arr[0].rightSide) {
        if (matchD(str, rule, arr)) {
          strInput.target.style.borderColor = "ForestGreen";
          return;
        }
      }
      strInput.target.style.borderColor = "FireBrick";
    } else if (type === "Left") {
      //console.log('Grammar type: ', type);

      for (let rule of arr[0].rightSide) {
        if (matchE(str, rule, arr)) {
          strInput.target.style.borderColor = "ForestGreen";
          return;
        }
      }
      strInput.target.style.borderColor = "FireBrick";
    } else {
      //console.log('Error: Invalid Grammar type! Accepted grammars: GLD, GLUD, GLE, GLUE.');
      alert("Gramática inválida! Aceita apenas GLD, GLUD, GLE e GLUE!");
      return;
    }
    return;
  };

  const matchD = (str, rule, arr) => {
    //console.log('Rule: ', rule);
    if (rule.length - 1 > str.length) return false;

    const nextRule = rule[rule.length - 1];
    //console.log('  Next rule: ', nextRule);

    //Verificando caractere vazio
    if (
      nextRule === "λ" &&
      rule.slice(0, rule.length - 1) === str &&
      rule.slice(0, rule.length - 1).length === str.length
    )
      return true;

    if (nextRule === nextRule.toLowerCase()) return rule === str;

    //Verificando se pode continuar: só vai continuar se aB, ababaA = a, ababa. Quando for B, deve seguir para ver as outras regras dele
    if (
      rule.length > 1 &&
      rule.slice(0, rule.length - 1) !== str.slice(0, rule.length - 1)
    )
      return false;

    const rules = arr.find((row) => row.leftSide === nextRule);
    //console.log('  Rules: ', rules.rightSide);

    if (!rules) return false;
    for (let r of rules.rightSide) {
      if (matchD(str, rule.replace(nextRule, r), arr)) {
        return true;
      }
    }
  };

  const matchE = (str, rule, arr) => {
    //console.log('Rule: ', rule);
    if (rule.length - 1 > str.length) return false;

    const nextRule = rule[0];
    //console.log('  NextRule: ', nextRule);

    //Verificando caractere vazio
    if (
      nextRule === "λ" &&
      rule.slice(1, rule.length) === str &&
      rule.slice(1, rule.length).length === str.length
    )
      return true;

    if (nextRule === nextRule.toLowerCase()) return rule === str;

    //Verificando se pode continuar: só vai continuar se aB, ababaA = a, ababa. Quando for B, deve seguir para ver as outras regras dele
    if (
      rule.length > 1 &&
      rule.slice(1, rule.length) !==
        str.slice(str.length - (rule.length - 1), str.length)
    )
      return false;

    const rules = arr.find((row) => row.leftSide === nextRule);
    //console.log('  Rules: ', rules.rightSide);

    if (!rules) return false;
    for (let r of rules.rightSide) {
      if (matchE(str, rule.replace(nextRule, r), arr)) {
        return true;
      }
    }
  };

  const convertToAutomaton = () => {
    const currentNodes = grammarInputs.map((rule, idx) => {
      const isFirstState = idx === 0;
      return {
        id: `q${idx}`,
        representationLetter: rule.leftSide,
        color: isFirstState ? "red" : "green",
        symbolType: isFirstState ? "triangle" : "square",
      };
    });
    const transitions = grammarInputs.map((rule, idx) => {
      const automatonState = `q${idx}`;

      const splittedRule = rule.rightSide.split("|");
      const convertedTransitions = splittedRule.map((str) => {
        const nonTerminal = getUpperCaseLetter(str).replaceAll(" ", "");
        const terminal = getLowerCaseLetter(str).replaceAll(" ", "");
        const target = currentNodes.find(
          (item) => item.representationLetter === nonTerminal
        );
        const transition = {
          source: automatonState,
          label: terminal || "λ",
          target: target?.id || automatonState,
        };
        return transition;
      });
      return convertedTransitions;
    }).flat(1);
    navigate("/autofin", {
      state: {
        transitions,
        nodes: currentNodes.map((item) => ({
          id: item.id,
          color: item.color,
          symbolType: item.symbolType,
        })),
      },
    });
  };

  return (
    <Container maxWidth="lg" style={styles.container}>
      <header style={styles.header}>
        <p style={styles.text}>Gramática regular</p>
      </header>
      {/* <Button onClick={convertToAutomaton}>Converter para automato</Button> */}

      <div style={{ width: "100%" }}>
        <div style={{ width: "50%", float: "left" }}>
          <div style={styles.main}>
            {grammarInputs.map((input, key) => (
              <GrammarInput
                key={`${input.leftSide}-${key.toString()}`}
                grammar={grammarInputs}
                leftSide={input.leftSide}
                rightSide={input.rightSide}
                cont={cont++}
              />
            ))}
          </div>
          <div style={styles.footer}>
            <Tooltip title="Adicionar regra">
              <Button
                style={styles.button}
                onClick={() => {
                  if (grammarInputs.length < 20)
                    setGrammarInputs([
                      ...grammarInputs,
                      { leftSide: "", rightSide: "" },
                    ]);
                }}
              >
                {" "}
                <AddOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
            <Tooltip title="Remover regra">
              <Button
                style={styles.button}
                onClick={() => {
                  if (grammarInputs.length > 1)
                    setGrammarInputs(
                      grammarInputs.slice(0, grammarInputs.length - 1)
                    );
                }}
              >
                {" "}
                <RemoveOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
          </div>
        </div>

        <Divider
          color="inherit"
          orientation="vertical"
          style={{ padding: "0.5px", height: "100%", float: "left" }}
        />

        <div style={{ width: "45%", float: "left" }}>
          <div style={styles.main}>
            {inputs.map((input, key) => (
              <div style={styles.item} key={key}>
                <input
                  type="text"
                  placeholder="String"
                  onChange={(strInput) => validate(strInput)}
                  onClick={(strInput) => {
                    validate(strInput);
                    strInput.target.placeholder = "";
                  }}
                  style={styles.input}
                />
              </div>
            ))}
          </div>
          <div style={styles.footer}>
            <Tooltip title="Adicionar">
              <Button
                style={styles.button}
                onClick={() => {
                  if (inputs.length < 10) setInputs([...inputs, 1]);
                }}
              >
                {" "}
                <AddOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
            <Tooltip title="Remover">
              <Button
                style={styles.button}
                onClick={() => {
                  if (inputs.length > 1)
                    setInputs(inputs.slice(0, inputs.length - 1));
                }}
              >
                {" "}
                <RemoveOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Container>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  helper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "10px",
  },
  button: {
    borderRadius: "5px",
    height: "30px",
    width: "20px",
    transitionDuration: "0.5s",
    marginRight: "10px",
  },
  header: {
    paddingBottom: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  text: {
    fontSize: "30px",
    textAlign: "center",
    margin: "0",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  main: {
    paddingBottom: "20px",
    margin: "0 auto",
    display: "flex",
    flexFlow: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    padding: "5px",
  },
  input: {
    borderWidth: "3px",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: "5px",
    height: "50px",
    width: "200px",
    outline: "0",
    fontSize: "20px",
  },
  input2: {
    borderWidth: "3px",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: "5px",
    height: "50px",
    width: "120px",
    outline: "0",
    fontSize: "20px",
  },
};
