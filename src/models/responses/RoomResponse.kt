package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.entities.Room

data class RoomResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("members") val members: List<UserResponse>,
    @SerializedName("purchases") val purchases: List<PurchaseResponse>
) {
    constructor(room: Room): this(
        room.id.value,
        room.name,
        transaction { room.members.map { UserResponse(it) } },
        transaction { room.purchases.map { PurchaseResponse(it) } }
    )

    companion object {
        val example = mapOf(
            "id" to 3,
            "name" to "My room",
            "members" to listOf(UserResponse.example, UserResponse.example),
            "purchases" to listOf(PurchaseResponse.example, PurchaseResponse.example, PurchaseResponse.example)
        )
    }
}