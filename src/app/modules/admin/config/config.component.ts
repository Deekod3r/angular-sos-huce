import { Component, OnDestroy, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditorModule } from 'primeng/editor';
import { MessageService } from 'primeng/api';
import { message, messageConfig, title } from 'src/app/common/message';

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [SharedModule, DropdownModule, InputTextareaModule, EditorModule],
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy {

    configs!: any;
    config!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private configService: ConfigService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getConfigs();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getConfigs(): void {
        this.configService.getConfigs()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configs = res.data;
            }
        });
    }

    getConfigValues(event: any): void {
        if(event.value) {
            this.configService.getConfigs(event.value)
            .pipe(takeUntil(this.subscribes$))
            .subscribe(res => {
                if (res.success) {
                    this.config = res.data;
                }
            });
        } else {
            this.config = null;
        }
    }

    saveConfig(): void {
        this.configService.updateConfig(this.config.id, this.config)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageConfig.updateSuccess });
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                }
            }
        });
    }

}
