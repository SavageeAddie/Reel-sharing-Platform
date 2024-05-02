import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define types for Reel and ReelPayload
type Reel = Record<{
    id: string;
    title: string;
    description: string;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
    // Add any other necessary fields for a reel
}>;

type ReelPayload = Record<{
    title: string;
    description: string;
    // Add any other necessary fields for creating or updating a reel
}>;

// Define types for User and UserPayload
type User = Record<{
    id: string;
    username: string;
    email: string;
    reels?: Vec<string>; // Array of reel IDs shared with the user
    // Add any other necessary fields for a user
}>;

type UserPayload = Record<{
    username: string;
    email: string;
    // Add any other necessary fields for creating or updating a user
}>;

// Create maps to store reel and user records
const reelStorage = new StableBTreeMap<string, Reel>(0, 44, 1024);
const userStorage = new StableBTreeMap<string, User>(1, 44, 1024);

$update;
export function createReel(payload: ReelPayload): Result<Reel, string> {
    // Validate payload
    if (!payload.title || !payload.description) {
        return Result.Err('Title and description are required for creating a reel.');
    }

    const reel: Reel = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
    reelStorage.insert(reel.id, reel);
    return Result.Ok(reel);
}

$query;
export function getReel(id: string): Result<Reel, string> {
    const reel = reelStorage.get(id);
    if (!reel) {
        return Result.Err(`Reel with id=${id} not found`);
    }
    return Result.Ok(reel);
}

$query;
export function getReels(): Result<Vec<Reel>, string> {
    return Result.Ok(reelStorage.values());
}

$update;
export function updateReel(id: string, payload: ReelPayload): Result<Reel, string> {
    // Validate payload
    if (!payload.title || !payload.description) {
        return Result.Err('Title and description are required for updating a reel.');
    }

    const reel = reelStorage.get(id);
    if (!reel) {
        return Result.Err(`Reel with id=${id} not found`);
    }

    const updatedReel: Reel = { ...reel, ...payload, updatedAt: Opt.Some(ic.time()) };
    reelStorage.insert(reel.id, updatedReel);
    return Result.Ok(updatedReel);
}

$update;
export function deleteReel(id: string): Result<Reel, string> {
    const deletedReel = reelStorage.remove(id);
    if (!deletedReel) {
        return Result.Err(`Reel with id=${id} not found`);
    }
    return Result.Ok(deletedReel);
}

$update;
export function shareReelToUser(reelId: string, userId: string): Result<string, string> {
    const reel = reelStorage.get(reelId);
    if (!reel) {
        return Result.Err(`Reel with id=${reelId} not found`);
    }

    const user = userStorage.get(userId);
    if (!user) {
        return Result.Err(`User with id=${userId} not found`);
    }

    if (user.reels && user.reels.includes(reelId)) {
        return Result.Err(`Reel with id=${reelId} is already shared with the user`);
    }

    user.reels = user.reels || [];
    user.reels.push(reelId);
    userStorage.insert(userId, user);

    return Result.Ok("Reel shared successfully");
}

$update;
export function addUser(payload: UserPayload): Result<User, string> {
    // Validate payload
    if (!payload.username || !payload.email) {
        return Result.Err('Username and email are required for creating a user.');
    }

    const user: User = { id: uuidv4(), ...payload };
    userStorage.insert(user.id, user);
    return Result.Ok(user);
}

$query;
export function getUser(id: string): Result<User, string> {
    const user = userStorage.get(id);
    if (!user) {
        return Result.Err(`User with id=${id} not found`);
    }
    return Result.Ok(user);
}

$query;
export function getUsers(): Result<Vec<User>, string> {
    return Result.Ok(userStorage.values());
}

$update;
export function deleteUser(id: string): Result<User, string> {
    const deletedUser = userStorage.remove(id);
    if (!deletedUser) {
        return Result.Err(`User with id=${id} not found`);
    }
    return Result.Ok(deletedUser);
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};
