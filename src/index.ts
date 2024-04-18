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
    const reel: Reel = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
    reelStorage.insert(reel.id, reel);
    return Result.Ok(reel);
}

$query;
export function getReel(id: string): Result<Reel, string> {
    return match(reelStorage.get(id), {
        Some: (reel) => Result.Ok<Reel, string>(reel),
        None: () => Result.Err<Reel, string>(`Reel with id=${id} not found`)
    });
}

$query;
export function getReels(): Result<Vec<Reel>, string> {
    return Result.Ok(reelStorage.values());
}

$update;
export function updateReel(id: string, payload: ReelPayload): Result<Reel, string> {
    return match(reelStorage.get(id), {
        Some: (reel) => {
            const updatedReel: Reel = {...reel, ...payload, updatedAt: Opt.Some(ic.time())};
            reelStorage.insert(reel.id, updatedReel);
            return Result.Ok<Reel, string>(updatedReel);
        },
        None: () => Result.Err<Reel, string>(`Reel with id=${id} not found`)
    });
}

$update;
export function deleteReel(id: string): Result<Reel, string> {
    return match(reelStorage.remove(id), {
        Some: (deletedReel) => Result.Ok<Reel, string>(deletedReel),
        None: () => Result.Err<Reel, string>(`Reel with id=${id} not found`)
    });
}

$update;
export function shareReelToUser(reelId: string, userId: string): Result<string, string> {
    return match(reelStorage.get(reelId), {
        Some: (reel) => {
            return match(userStorage.get(userId), {
                Some: (user) => {
                    // Check if the reel is already shared with the user
                    if (user.reels && user.reels.includes(reelId)) {
                        return Result.Err<string, string>(`Reel with id=${reelId} is already shared with the user`);
                    }
                    
                    // Update the user record to include the shared reel
                    if (!user.reels) {
                        user.reels = [reelId];
                    } else {
                        user.reels.push(reelId);
                    }
                    
                    // Update the user record in storage
                    userStorage.insert(userId, user);
                    
                    return Result.Ok<string, string>("reel shared successfully");
                },
                None: () => Result.Err<string, string>(`User with id=${userId} not found`)
            });
        },
        None: () => Result.Err<string, string>(`Reel with id=${reelId} not found`)
    });
}

$update;
export function addUser(payload: UserPayload): Result<User, string> {
    const user: User = { id: uuidv4(), ...payload };
    userStorage.insert(user.id, user);
    return Result.Ok(user);
}

$query;
export function getUser(id: string): Result<User, string> {
    return match(userStorage.get(id), {
        Some: (user) => Result.Ok<User, string>(user),
        None: () => Result.Err<User, string>(`User with id=${id} not found`)
    });
}

$query;
export function getUsers(): Result<Vec<User>, string> {
    return Result.Ok(userStorage.values());
}

$update;
export function deleteUser(id: string): Result<User, string> {
    return match(userStorage.remove(id), {
        Some: (deletedUser) => Result.Ok<User, string>(deletedUser),
        None: () => Result.Err<User, string>(`User with id=${id} not found`)
    });
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
