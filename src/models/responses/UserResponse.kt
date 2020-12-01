package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import ru.neexol.debtable.db.entities.User

data class UserResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("username") val username: String,
    @SerializedName("display_name") val displayName: String
) {
    constructor(user: User): this(user.id.value, user.username, user.displayName)
}