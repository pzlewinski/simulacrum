import { Store, Faker } from '@simulacrum/server';
import { Operation } from 'effection';

import { records } from './context';
import { droidNames, droidFunctions, humanNames, planetNames } from './data';
import { Character, Episode } from '../schema/types';


export type ManyScenarioParams = {
  n?: number;
}

function *droid(store: Store, faker: Faker): Operation<void> {
  let characters = records<Character>(store, 'characters');
  let id = faker.datatype.uuid();

  characters.slice(id).set({
    __typename: 'Droid',
    id,
    friends: [],
    name: faker.random.arrayElement(droidNames),
    appearsIn: faker.random.arrayElements(Object.values(Episode)),
    primaryFunction: faker.random.arrayElement(droidFunctions),
  });

  yield makeFriends(id, store, faker);
}

function *human(store: Store, faker: Faker): Operation<void> {
  let characters = records<Character>(store, 'characters');
  let id = faker.datatype.uuid();

  characters.slice(id).set({
    __typename: 'Human',
    id,
    friends: [],
    name: faker.random.arrayElement(humanNames),
    appearsIn: faker.random.arrayElements(Object.values(Episode)),
    homePlanet: faker.random.arrayElement(planetNames),
  });

  yield makeFriends(id, store, faker);
}

function *makeFriends(id: string, store: Store, faker: Faker): Operation<void> {
  let characters = records<Character>(store, 'characters');
  let target = characters.slice(id);
  let newFriends = faker.random.arrayElements(
    Object.keys(characters.get()).filter(friendId => friendId !== id),
    faker.datatype.number({ min: 1, max: 5 })
  );

  target.set({
    ...target.get(),
    friends: newFriends,
  });

  newFriends
    .map(id => characters.slice(id))
    .forEach(newFriend => {
      newFriend.set({
        ...newFriend.get(),
        friends: [...newFriend.get().friends, id],
      });
    });
}

function *droids(store: Store, faker: Faker, { n = 1 }: ManyScenarioParams): Operation<void> {
  for(let i = 0; i < n; i++) {
    yield droid(store, faker);
  }
}

function *humans(store: Store, faker: Faker, { n = 1 }: ManyScenarioParams): Operation<void> {
  for(let i = 0; i < n; i++) {
    yield human(store, faker);
  }
}

function *droidsAndHumans(store: Store, faker: Faker, { n = 1 }: ManyScenarioParams): Operation<void> {
  for(let i = 0; i < n; i++) {
    yield faker.datatype.boolean() ?
      droid(store, faker) :
      human(store, faker);
  }
}

export const scenarios = {
  droid,
  human,
  droids,
  humans,
  droidsAndHumans,
};
