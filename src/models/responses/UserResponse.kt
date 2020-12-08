package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import ru.neexol.debtable.db.entities.User

data class UserResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("username") val username: String,
    @SerializedName("display_name") val displayName: String
) {
    constructor(user: User): this(user.id.value, user.username, user.displayName)

    companion object {
        val EXAMPLES = listOf(
            mapOf(
                "id" to 1,
                "username" to "admin",
                "display_name" to "Tester Testerov"
            ),
            mapOf(
                "id" to 2,
                "username" to "neexol",
                "display_name" to "Nikita Alexeev"
            ),
            mapOf(
                "id" to 3,
                "username" to "vovcrane",
                "display_name" to "Vladimir Zhuravlev"
            )
        )
    }
}