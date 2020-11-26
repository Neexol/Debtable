package ru.neexol.debtable.models.responses

import ru.neexol.debtable.db.entities.User

data class UserResponse(
    val username: String,
    val displayName: String
) {
    constructor(user: User): this(user.username, user.displayName)
}