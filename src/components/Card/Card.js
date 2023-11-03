import React, { useState, useEffect } from "react";
import {
  getAbilityData,
  getPokemonSpecies,
  getTypeData,
} from "../../utils/pokemon";
import "./Card.css";

const Card = ({ pokemon }) => {
  const [pokemonNameJP, setPokemonNameJP] = useState("");
  const [pokemonTypesJP, setPokemonTypesJP] = useState([]);
  const [pokemonAbilitiesJP, setPokemonAbilitiesP] = useState([]);

  //ポケモンの高さをデシメートル単位からメートルに変換し、小数点第二位まで表示
  const heightInM = Math.floor(pokemon.height * 10) / 100;

  useEffect(() => {
    // ポケモンの種に関するデータを取得
    getPokemonSpecies(pokemon.species.url).then((speciesData) => {
      const jpNameEntry = speciesData.names.find(
        (name) => name.language.name === "ja"
      );
      setPokemonNameJP(jpNameEntry ? jpNameEntry.name : pokemon.name);
    });

    // タイプの日本語名を取得
    const fetchTypesJP = async () => {
      const typesJP = await Promise.all(
        pokemon.types.map((type) => {
          return getTypeData(type.type.url);
        })
      );

      setPokemonTypesJP(
        typesJP.map((typeData) => {
          const jpTypeEntry = typeData.names.find(
            (name) => name.language.name === "ja"
          );
          return jpTypeEntry ? jpTypeEntry.name : typeData.name;
        })
      );
    };

    //アビリティの日本語名を取得
    const fetchAbilitiesJP = async () => {
      const abilitiesJP = await Promise.all(
        pokemon.abilities.map((ability) => {
          return getAbilityData(ability.ability.url);
        })
      );

      setPokemonAbilitiesP(
        abilitiesJP.map((abilityData) => {
          const jpAbilityEntry = abilityData.names.find(
            (name) => name.language.name === "ja"
          );
          return jpAbilityEntry ? jpAbilityEntry.name : abilityData.name;
        })
      );
    };

    fetchTypesJP();
    fetchAbilitiesJP();
  }, [pokemon.species.url, pokemon.types, pokemon.name, pokemon.abilities]);

  return (
    <div className="card">
      <div className="cardImg">
        <img src={pokemon.sprites.front_default} alt={pokemonNameJP} />
        <h3 className="cardName">{pokemonNameJP}</h3>
        <div className="cardTypes">
          {pokemonTypesJP.map((typeNameJP, index) => (
            <span key={index} className="typeName">
              {typeNameJP}
            </span>
          ))}
        </div>
        <div className="cardInfo">
          <div className="cardData">
            <p className="title">重さ: {pokemon.weight}kg</p>
          </div>
          <div className="cardData">
            <p className="title">高さ: {heightInM}m</p>
          </div>
          <div className="cardData">
            <p className="title">{pokemonAbilitiesJP.join(",")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
