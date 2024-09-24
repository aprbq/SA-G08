package pointstransection

// import (
//     "time"
//     "gorm.io/gorm"
//     "net/http"

// 	"example.com/sa-67-example/config"
// 	"example.com/sa-67-example/entity"
// 	"github.com/gin-gonic/gin"
// )

// // SavePointsTransaction จะบันทึกข้อมูลการทำธุรกรรมคะแนน
// func SavePointsTransaction(orderConfirm OrderConfirm, db *gorm.DB) error {
//     // ตรวจสอบว่าเป็น member หรือไม่ และดึงข้อมูล member
//     member, err := GetMemberByPhoneNumber(orderConfirm.PhoneNumber)
//     if err != nil {
//         return err
//     }

//     // สร้างรายการ points transaction
//     pointsTransaction := PointsTransactions{
//         TransactionstDate: time.Now(),
//         PointsUsed:        order.PointsUsed,
//         PointsAdd:         order.PointsAdd,
//         Description:       "Description of the transaction",
//         MemberID:          &member.ID,
//         PromotionID:       &order.PromotionID,
//     }

//     // บันทึกลงในฐานข้อมูล
//     if err := db.Create(&pointsTransaction).Error; err != nil {
//         return err
//     }

//     return nil
// }