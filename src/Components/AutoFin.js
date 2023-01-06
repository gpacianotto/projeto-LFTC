import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Graph } from "react-d3-graph";
import Button from "@material-ui/core/Button/Button";
import Delete from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider/Divider";
import Container from "@material-ui/core/Container/Container";
import { withStyles } from "@material-ui/core/styles";

import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { ControllerContainer } from "./styles/AutoFinStyles";
import { useEffect } from "react";

export default function AutoFin(props) {
  const {state} = useLocation();
  console.log({state})
  const initialNodes = [
    { id: "q0", symbolType: "triangle", x: 500, y: 500 },
    { id: "q1", color: "green", symbolType: "square", x: 430, y: 530 },
    { id: "q2", color: "green", symbolType: "square", x: 540, y: 540 },
  ];

  const initialTransitions = [
    { source: "q0", target: "q1", label: "a" },
    { source: "q0", target: "q2", label: "b" },
  ]; 

  const [nodes, setNodes] = useState(state?.nodes || initialNodes);

  const [transitions, setTransitions] = useState(state?.transitions || initialTransitions);

  const initialTransitionInput = { source: "", target: "", label: "λ" };

  const [transitionInput, setTransitionInput] = useState(
    initialTransitionInput
  );

  const [deleteMode, setDeleteMode] = useState(false);
  const [inputs, setInputs] = useState([1]);

  
  const myConfig = {
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    directed: true,
    maxZoom: 7,
    height: 1000,
    width: 1000,
    node: {
      color: "black",
      size: 120,
      highlightStrokeColor: "blue",
      labelPosition: "top",
    },
    link: {
      highlightColor: "lightblue",
      renderLabel: true,
    },
  };

  const onClickNode = (nodeId) => {
    if (deleteMode) {
      setTransitions(
        transitions.filter((t) => t.source !== nodeId && t.target !== nodeId)
      );
      setNodes(nodes.filter((node) => node.id !== nodeId));
    } else {
      setNodes(
        nodes.map((node) => {
          if (node.id === nodeId) {
            if (node.color === "green") node.color = "black";
            else node.color = "green";
          }
          return node;
        })
      );
    }
  };

  const onClickLink = (source, target) => {
    if (deleteMode)
      setTransitions(
        transitions.filter((t) => t.source !== source || t.target !== target)
      );
  };

  const validate = (strInput) => {
    let charCode = 65;
    const str = strInput.target.value;
    let tempTransitions = [];
    let tempNodes = [];
    transitions.forEach((tr) => tempTransitions.push(Object.assign({}, tr)));
    nodes.forEach((node) => tempNodes.push(Object.assign({}, node)));

    tempNodes = tempNodes.map((node) => {
      const newValue = String.fromCharCode(charCode);
      tempTransitions.forEach((tr) => {
        if (tr.source === node.id) tr.source = newValue;
        if (tr.target === node.id) tr.target = newValue;
      });
      node.id = newValue;
      let type = [];
      if (node.symbolType === "triangle") type.push("initial");
      if (node.color === "green") type.push("final");
      node.type = type;
      charCode += 1;
      return node;
    });
    let grammar = [];
    for (let i = 0; i < tempTransitions.length; i++) {
      let initial = tempTransitions[i].source;
      let final = tempTransitions[i].target;
      let value = tempTransitions[i].label;

      let rules = grammar.find((row) => row.leftSide === initial);

      if (!rules) {
        if (value === "λ")
          grammar.push({ leftSide: initial, rightSide: [final] });
        else grammar.push({ leftSide: initial, rightSide: [value + final] });
      } else {
        if (value === "λ") rules.rightSide.push(final);
        else rules.rightSide.push(value + final);
      }
    }
    for (let i = 0; i < tempNodes.length; i++) {
      let initial = tempNodes[i].id;
      let type = tempNodes[i].type.find((row) => row === "final");
      if (type) {
        let rules = grammar.find((row) => row.leftSide === initial);

        if (!rules)
          //Se não tem
          grammar.push({ leftSide: initial, rightSide: ["λ"] });
        //Se tem
        else rules.rightSide.push("λ");
      }
    }
    for (let i = 0; i < tempNodes.length; i++) {
      let initial = tempNodes[i].id;
      let type = tempNodes[i].type.find((row) => row === "initial");

      if (type) {
        let rules = grammar.find((row) => row.leftSide === initial); //Verificando se existe regra com aquele simbolo
        grammar = grammar.filter((item) => item !== rules);
        grammar.unshift(rules);
      }
    }

    for (let rule of grammar[0].rightSide) {
      if (matchD(str, rule, grammar)) {
        strInput.target.style.borderColor = "Green";
        return;
      }
    }
    strInput.target.style.borderColor = "Red";
  };

  const matchD = (str, rule, arr) => {
    if (rule.length - 1 > str.length) return false;

    const nextRule = rule[rule.length - 1];

    //Verificando caractere vazio
    if (
      nextRule === "λ" &&
      rule.slice(0, rule.length - 1) === str &&
      rule.slice(0, rule.length - 1).length === str.length
    )
      return true;

    if (nextRule === nextRule.toLowerCase()) return rule === str;

    const rules = arr.find((row) => row.leftSide === nextRule);

    if (!rules) return false;
    for (let r of rules.rightSide) {
      if (matchD(str, rule.replace(nextRule, r), arr)) {
        return true;
      }
    }
  };

  const restart = () => {
    setNodes(initialNodes);
    setTransitions(initialTransitions);
    setTransitionInput(initialTransitionInput);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "40%",
          border: "1px solid black",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <header style={styles.header}>
          <p style={styles.text}>Autômato finito</p>
        </header>
        <ControllerContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Button
              style={{ marginBottom: "15px" }}
              variant="contained"
              color="default"
              onClick={() => {
                if (nodes.length > 0)
                  setNodes([
                    ...nodes,
                    { id: `q${parseInt(nodes[nodes.length - 1].id[1]) + 1}`, x: 500, y: 500 },
                  ]);
                else setNodes([{ id: "q0", symbolType: "triangle" }]);
              }}
            >
              {`Adicionar estado q${nodes.length}`}
            </Button>
            <Button
              style={{ maxHeight: 100 }}
              variant="contained"
              color="default"
              onClick={() => restart()}
            >
              Recomeçar
            </Button>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <input
                placeholder={"Nó inicial:"}
                style={styles.input}
                value={transitionInput.source}
                onChange={(e) =>
                  setTransitionInput({
                    ...transitionInput,
                    source: e.target.value,
                  })
                }
              />
              <input
                placeholder={"Nó final:"}
                style={styles.input}
                value={transitionInput.target}
                onChange={(e) =>
                  setTransitionInput({
                    ...transitionInput,
                    target: e.target.value,
                  })
                }
              />
              <input
                placeholder={"Estado:"}
                style={styles.input}
                value={transitionInput.label}
                onChange={(e) =>
                  setTransitionInput({
                    ...transitionInput,
                    label: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button
            style={{ marginTop: "15px" }}
            variant="contained"
            color="default"
            onClick={() => {
              const tr = transitions.find(
                (t) =>
                  t.source === transitionInput.source &&
                  t.target === transitionInput.target &&
                  t.label === transitionInput.label
              );
              if (!tr) setTransitions([...transitions, transitionInput]);
              setTransitionInput({ source: "", target: "", label: "λ" });
            }}
          >
            Adicionar transição
          </Button>
        </ControllerContainer>
        <Divider
          color="inherit"
          style={{ margin: "15px", width: "95%", alignSelf: "center" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Escreva uma entrada para testar</p>
          {inputs.map((i, key) => (
            <input
              key={`input-${key}`}
              type="text"
              placeholder="String"
              onChange={(strInput) => validate(strInput)}
              onClick={(strInput) => {
                validate(strInput);
                strInput.target.placeholder = "String a testar";
              }}
              style={styles.input}
            />
          ))}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Adicionar">
              <Button
                style={styles.button}
                onClick={() => {
                  if (inputs.length < 7) setInputs([...inputs, 1]);
                }}
              >
                <AddOutlinedIcon color="action" />
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
                <RemoveOutlinedIcon color="action" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div style={{ width: "60%", border: "1px solid green", height: "100vh" }}>
        <Graph
          id="graph-id"
          data={{
            nodes: nodes,
            links: transitions,
          }}
          config={myConfig}
          onClickNode={onClickNode}
          onClickLink={onClickLink}
        />
      </div>
    </div>
  );
}

const styles = {
  input: {
    borderWidth: "3px",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: "5px",
    height: "30px",
    width: "250px",
    outline: "0",
    fontSize: "20px",
    marginBottom: "10px",
  },
  helper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "10px",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
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
    marginBottom: "30px",
    paddingTop: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  text: {
    fontSize: "30px",
    textAlign: "center",
    margin: "0",
  },
};
